export default class ModuleScopePlugin {
    private readonly appSources;
    private readonly allowedFiles;
    constructor(appSrc: string, allowedFiles?: string[]);
    apply(compiler: any): void;
}
