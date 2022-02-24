import { FSABuilder } from "./fsa-fluent-builder";

test('create a empty fsa throws error', () => {
    expect(() => new FSABuilder().build()).toThrow();
});

test('create a fsa without accepting state throws error', () => {
    expect(() => new FSABuilder().states('a').initial('a').build()).toThrow();
});

test('create a fsa without initial state throws error', () => {
    expect(() => new FSABuilder().states('a').final('a').build()).toThrow();
});

test('create a fsa', () => {
    expect(() => new FSABuilder().states('a').initial('a').final('a').build()).toBeDefined();
});

test('create a fsa and accept a symbol', () => {
    const fsa = new FSABuilder()
        .states('a', 'b')
        .initial('a')
        .final('b')
        .alphabet('ON')
        .transition('a', 'b', 'ON')
        .build();

    expect(fsa.accept('ON')).toBe(true);
});


test('create a fsa and accept a string', () => {
    const fsa = new FSABuilder()
        .states('a', 'b')
        .initial('a')
        .final('b')
        .alphabet('ON')
        .transition('a', 'b', 'ON')
        .build();

    expect(fsa.acceptFully(['ON'])).toBe(true);
});


test('create a fsa and refuse a string due to non-accepting state', () => {
    const fsa = new FSABuilder()
        .states('a', 'b', 'c')
        .initial('a')
        .final('c')
        .alphabet('ON', 'OFF')
        .transition('a', 'b', 'ON')
        .build();

    expect(fsa.acceptFully(['ON'])).toBe(false);
});

test('create a fsa and refuse a string due to an invalid move', () => {
    const fsa = new FSABuilder()
        .states('a', 'b', 'c')
        .initial('a')
        .final('c')
        .alphabet('ON', 'OFF')
        .transition('a', 'b', 'ON')
        .transition('b', 'c', 'OFF')
        .build();

    expect(fsa.acceptFully(['ON', 'ON'])).toBe(false);
});

test('reset a fsa returns to inital state', () => {
    const fsa = new FSABuilder()
        .states('a', 'b', 'c')
        .initial('a')
        .final('c')
        .alphabet('ON', 'OFF')
        .transition('a', 'b', 'ON')
        .transition('b', 'c', 'OFF')
        .build();

    fsa.acceptFully(['ON', 'OFF']);

    expect(fsa.state).toBe('c');

    fsa.reset();

    expect(fsa.state).toBe('a');
});