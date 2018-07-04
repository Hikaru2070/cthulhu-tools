import { Reference, CharacterContext } from "models/data";
import { Cache, EvaluationChain, buildResolver, buildEvaluator, buildValidator } from "models/eval";

export * from "models/data";
export * from "models/eval";

export class Status {
	private readonly chain: EvaluationChain;

	public constructor(readonly context: CharacterContext, cache?: Cache) {
		const resolver = buildResolver({ attributes: context.profile.attributes, skills: context.profile.skills });
		const evaluator = buildEvaluator({ params: context.character.params, history: context.history });
		const validator = buildValidator({ attribute: true, skill: true });
		this.chain = new EvaluationChain({ resolver, evaluator, validator, cache });
	}

	public get current(): string | null { return this.context.history && this.context.history.head; }

	public get(key: string, hash?: string | null): any {
		const ref = Reference.parse(key);

		return ref ? this.getByRef(ref, hash) : undefined;
	}

	public getByRef(ref: Reference, hash: string | null = this.current): any {
		ref = ref.scope !== null ? ref : ref.set({ scope: "attr" });

		return this.chain.evaluate(ref, hash);
	}
}