export interface ReleaseNote {
    version: string;
    date: string;
    features: string[];
    fixes: string[];
    breaking: string[];
    improvements: string[];  // refactor, perf
    maintenance: string[];   // chore, build, ci
    styling: string[];       // style
    documentation: string[]; // docs
    other: string[];
}

export interface VersionInfo {
    current: string;
    previous: string;
    hasUpdate: boolean;
    releaseNotes?: ReleaseNote;
}