export type FSATransitionFunction<State,Input> = (state: State, input: Input) => State | undefined;

export interface FSADefinition<State, Input>{
    transition: FSATransitionFunction<State,Input>
    acceptingState: Set<State>
    initialState: State
}

export class FSA<State, Input>{    
    private currentState: State;

    constructor(public readonly definition: FSADefinition<State,Input>){
        this.currentState = definition.initialState;
    }

    public accept(input: Input): boolean{
        const newState = this.definition.transition(this.currentState, input);
        if (newState === undefined)
            return false;
        this.currentState = newState;
        return true;
    }

    public isCurrentStateAccepting(): boolean{
        return this.definition.acceptingState.has(this.currentState);
    }

    public acceptFully(string: Input[]): boolean{
       for (let input of string){
           if (!this.accept(input))
                return false;
       }
       return this.isCurrentStateAccepting();
    }

    public reset(): void{
        this.currentState = this.definition.initialState;
    }
    
    public get state() : State {
        return this.currentState;
    }
}

