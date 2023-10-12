
export interface IFile{

    readFileContent(file: File): Promise<string>
}
