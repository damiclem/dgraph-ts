import {Connection} from "./connection";

test('Connects to test Dgraph server', () => {
    // TODO Make proper test
    expect(new Connection('not-an-uri').uri).toBe('not-an-uri');
})