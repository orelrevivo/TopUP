export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export async function transcribeAudio(audioPath: string, language: string = "en"): Promise<TranscriptSegment[]> {
  return [
    { start: 12.5, end: 28.0, text: "I can't believe we actually pulled off this clutch play on stream!" },
    { start: 45.0, end: 68.2, text: "Here is the exact tutorial on how to set up your livestream bitrate properly." },
    { start: 110.0, end: 135.5, text: "Wait, did he really just try to do that in front of 5000 viewers?!" }
  ];
}
