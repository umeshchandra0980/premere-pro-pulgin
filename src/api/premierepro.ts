import { premierepro } from "../globals";
import { Constants } from "@adobe/premierepro";
import { cloneSequence } from "bolt-uxp-utils/ppro";

export const notify = async (message: string) => {
  alert(message);
};

export const getProjectInfo = async () => {
  const project = await premierepro.Project.getActiveProject();
  const info = {
    name: project.name,
    path: project.path,
    id: project.guid.toString(),
  };
  return info;
};

export const getPlayheadSeconds = async (): Promise<number | null> => {
  try {
    if (!premierepro || !premierepro.Project) return null;
    const project = await premierepro.Project.getActiveProject();
    if (!project) return null;
    const seq = await project.getActiveSequence();
    if (!seq) return null;
    const position = await seq.getPlayerPosition();
    return position ? position.seconds : null;
  } catch (e) {
    return null;
  }
};

export const importSrtAsCaptionTrack = async (srtContent: string) => {
  if (!premierepro || !premierepro.Project) throw new Error('Not running in Premiere Pro');
  const project = await premierepro.Project.getActiveProject();
  if (!project) throw new Error('No active project found');
  const seq = await project.getActiveSequence();
  if (!seq) throw new Error('No active sequence found');

  try {
    const lfs = (require('uxp') as any).storage.localFileSystem;
    if (!lfs) throw new Error('UXP localFileSystem not available');
    
    const tempFolder = await lfs.getTemporaryFolder();
    const tempFile = await tempFolder.createFile('kalakar_captions.srt', { overwrite: true });
    await tempFile.write(srtContent);
    const nativePath = tempFile.nativePath;

    const rootItem = await project.getRootItem();
    const imported = await project.importFiles([nativePath], true, rootItem as any, false);
    if (!imported) throw new Error('Failed to import SRT file into project');

    throw new Error('SRT file successfully added to your Project Bin!\n\nDue to Adobe UXP API limits, we cannot auto-place it on the timeline.\nTo view your captions:\n1. Open your Project panel, locate "kalakar_captions.srt", and drag it onto your timeline.\nOR\n1. Open the Text panel (Window > Text).\n2. Under Captions, click "Import captions from file" and select the SRT.');
  } catch (err: any) {
    throw new Error(`Import failed: ${err.message}`);
  }
};

export const isTopVideoTrackEmpty = async (): Promise<boolean> => {
  if (!premierepro || !premierepro.Project) return false;
  const project = await premierepro.Project.getActiveProject();
  if (!project) return false;
  const seq = await project.getActiveSequence();
  if (!seq) return false;

  const count = await seq.getVideoTrackCount();
  if (count === 0) return false;

  const track = await seq.getVideoTrack(count - 1);
  if (!track) return false;

  // Use the proper enum instead of hardcoded 1
  const clips = track.getTrackItems(Constants.TrackItemType.CLIP, false);
  return clips.length === 0;
};

export const insertRenderedCaptionsToTimeline = async (assets: any[]) => {
  if (!premierepro || !premierepro.Project) throw new Error('Not running in Premiere Pro');
  const project = await premierepro.Project.getActiveProject();
  if (!project) throw new Error('No active project found');
  const seq = await project.getActiveSequence();
  if (!seq) throw new Error('No active sequence found');

  const lfs = (require('uxp') as any).storage.localFileSystem;
  if (!lfs) throw new Error('UXP localFileSystem not available');

  const rootItem = await project.getRootItem();
  const tempFolder = await lfs.getTemporaryFolder();

  const videoTrackCount = await seq.getVideoTrackCount();
  if (videoTrackCount === 0) throw new Error('No video tracks available in the sequence.');
  const targetTrackIndex = videoTrackCount - 1; 

  const isTopEmpty = await isTopVideoTrackEmpty();
  if (!isTopEmpty) {
    throw new Error('Add an empty video track above your footage in Premiere, then try exporting again.');
  }

  const failedSegments: string[] = [];

  for (const asset of assets) {
    try {
      const url = asset.download_url || asset.s3_url;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to download ${url}`);
      const arrayBuffer = await res.arrayBuffer();

      const fileName = `caption_${asset.segment_id}.mov`;
      const tempFile = await tempFolder.createFile(fileName, { overwrite: true });
      await tempFile.write(arrayBuffer);
      const nativePath = tempFile.nativePath;

      const imported = await project.importFiles([nativePath], true, rootItem as any, false);
      if (!imported) throw new Error(`Failed to import ${fileName} into project`);

      const rootChildren = await rootItem.getItems();
      const importedItem = rootChildren.find((i: any) => i.name === fileName);
      if (!importedItem) throw new Error(`Imported item ${fileName} not found in root bin`);

      const startTimeTick = premierepro.TickTime.createWithSeconds(asset.start_time);
      const editor = premierepro.SequenceEditor.getEditor(seq);
      const action = editor.createInsertProjectItemAction(importedItem as any, startTimeTick, targetTrackIndex, -1, true);

      const success = project.executeTransaction((compoundAction: any) => {
        compoundAction.addAction(action);
      }, `Insert Caption ${asset.segment_id}`);

      if (!success) {
        throw new Error(`Transaction failed for segment ${asset.segment_id}`);
      }
    } catch (err: any) {
      console.error('Asset insertion failed', err);
      failedSegments.push(`Segment ${asset.segment_id}: ${err.message}`);
    }
  }

  if (failedSegments.length > 0) {
    throw new Error(`Failed to insert the following segments:\n${failedSegments.join('\n')}`);
  }
};
