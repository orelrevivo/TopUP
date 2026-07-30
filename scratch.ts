import { StreamingMessageParser } from './app/lib/runtime/message-parser';

const parser = new StreamingMessageParser();

const input = `<falborArtifact title="Social Media App" id="project">
<falborAction type="file" filePath="/home/project/src/components/Header.css">
.header { position: fixed; top: 0; left: 0; }`;

console.log('OUTPUT:', JSON.stringify(parser.parse('msg1', input)));
