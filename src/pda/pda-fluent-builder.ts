import { PDA, PDATransitionFunction } from "./pda";

interface PDACompleteTransition<States, InputAlphabet, StackAlphabet> {
    from: States,
    to: States,
    on: [InputAlphabet | undefined, StackAlphabet | undefined]
    string: StackAlphabet[]
}

export class PDABuilder<States = never, InputAlphabet = never, StackAlphabet = never>{

    private _states: States[] | undefined;
    private _inputAlphabet: InputAlphabet[] | undefined;
    private _stackAlphabet: StackAlphabet[] | undefined;
    private _transitions: PDACompleteTransition<States, InputAlphabet, StackAlphabet>[] = [];
    private _accepting: States[] = [];
    private _initial: States | undefined;

    states<T extends string, ReturnType extends PDABuilder<States | T, InputAlphabet, StackAlphabet>>(...states: T[]): ReturnType {
        const builder = this as unknown as ReturnType;
        if (builder._states === undefined)
            builder._states = [];
        builder._states.push(...states);
        return builder;
    }

    inputAlphabet<T extends string, ReturnType extends PDABuilder<States, InputAlphabet | T, StackAlphabet>>(...alphabet: T[]): ReturnType {
        const builder = this as unknown as ReturnType;
        if (builder._inputAlphabet === undefined)
            builder._inputAlphabet = [];
        builder._inputAlphabet.push(...alphabet);
        return builder;
    }

    stackAlphabet<T extends string, ReturnType extends PDABuilder<States, InputAlphabet, StackAlphabet | T>>(...alphabet: T[]): ReturnType {
        const builder = this as unknown as ReturnType;
        if (builder._stackAlphabet === undefined)
            builder._stackAlphabet = [];
        builder._stackAlphabet.push(...alphabet);
        return builder;
    }

    final(...state: States[]) {
        this._accepting.push(...state);
        return this;
    }

    initial(state: States) {
        this._initial = state;
        return this;
    }

    transition(transition: PDACompleteTransition<States, InputAlphabet, StackAlphabet>) {
        this._transitions.push(transition);
        return this;
    }

    build(): PDA<States, InputAlphabet, StackAlphabet> {
        const transitionFunction: PDATransitionFunction<States, InputAlphabet, StackAlphabet> = (({ from, input, tos }) => {
            for (const transition of this._transitions) {
                if (transition.from !== from)
                    continue;
                const [transitionInput, transitionTOS] = transition.on;
                if (transitionInput !== undefined && transitionInput !== input)
                    continue;

                if (transitionTOS !== tos)
                    continue;

                const { to, string } = transition;

                return { to, string };
            }
            return undefined;
        });

        if (this._initial === undefined || this._accepting.length === 0)
            throw new Error("Must have an initial state and at least one accepting states");

        return new PDA({
            initial: this._initial,
            accepting: new Set(this._accepting),
            transition: transitionFunction
        })
    }

}


