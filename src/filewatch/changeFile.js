import addFile from './addFile';
import unlinkFile from './unlinkFile';

export default async function changeFile(path) {
    await unlinkFile(path);
    await addFile(path);
}