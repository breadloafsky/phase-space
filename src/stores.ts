import { writable } from 'svelte/store';
import { ProgramParams, MetaParams } from "./types/Params"

export const programParams = writable<ProgramParams>({
	...new ProgramParams()
})
export const metaParams = writable<MetaParams>({
	...new MetaParams()
});

