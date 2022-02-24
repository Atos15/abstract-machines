export interface PDATransition<States, StackAlphabet>{
    to: States
    string: StackAlphabet[]
}

export interface PDASnapshot<States, InputAlphabet, StackAlphabet>{
    from: States
    input: InputAlphabet | undefined
    tos: StackAlphabet | undefined
}

export type PDATransitionFunction<States, InputAlphabet, StackAlphabet> = 
    (snapshot: PDASnapshot<States, InputAlphabet, StackAlphabet>) => PDATransition<States,StackAlphabet> | undefined;

export interface PDADefinition<States, InputAlphabet, StackAlphabet>{
    initial: States;
    accepting: Set<States>;
    transition: PDATransitionFunction<States, InputAlphabet, StackAlphabet>
}

export class PDA<States, InputAlphabet, StackAlphabet>{

    private currentState: States;
    private stack: StackAlphabet[] = [];

    constructor(private definition: PDADefinition<States, InputAlphabet, StackAlphabet>){
        this.currentState = definition.initial;
    }

    accept(input: InputAlphabet): boolean{

        const tos = this.stack.pop();

        const transition = this.definition.transition({
            from: this.currentState,
            input,
            tos
        })

        if (transition === undefined)
            return true;
        
        const {to, string} = transition;

        this.currentState = to;
        this.stack.push(...string);

        return true;
    }

}