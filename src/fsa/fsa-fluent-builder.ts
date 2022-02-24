import { FSA, FSATransitionFunction } from "./fsa";

interface FSATransition<States, Alphabet> {
    from: States,
    to: States,
    on: Alphabet
}

export class FSABuilder<States = never, Alphabet = never>{

    private _states: States[] | undefined;
    private _alphabet: Alphabet[] | undefined;
    private _transitions: FSATransition<States, Alphabet>[] = [];
    private _accepting: States[] = [];
    private _initial: States | undefined;

    states<T extends string, ReturnType extends FSABuilder<States | T, Alphabet>>(...states: T[]): ReturnType {
        const builder = this as unknown as ReturnType;
        if (builder._states === undefined)
            builder._states = [];
        builder._states.push(...states);
        return builder;
    }

    alphabet<T extends string, ReturnType extends FSABuilder<States, Alphabet | T>>(...alphabet: T[]): ReturnType {
        const builder = this as unknown as ReturnType;
        if (builder._alphabet === undefined)
            builder._alphabet = [];
        builder._alphabet.push(...alphabet);
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

    transition(from: States, to: States, on: Alphabet) {
        this._transitions.push({
            from,
            to,
            on
        });
        return this;
    }


    build(): FSA<States, Alphabet> {
        const transitionFunction: FSATransitionFunction<States, Alphabet> = (state, input) => {
            for (const transition of this._transitions) {
                if (transition.from === state && transition.on === input)
                    return transition.to;
            }
            return undefined;
        }

        if (this._initial === undefined || this._accepting.length === 0)
            throw new Error("Must have an initial state and at least one accepting states");

        return new FSA({
            initialState: this._initial,
            acceptingState: new Set(this._accepting),
            transition: transitionFunction
        })
    }

}


