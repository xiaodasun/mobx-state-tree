import { types } from "../"
import { test } from "ava"

const createTestFactories = () => {
    const Box = types.model({
        width: 0,
        height: 0
    })

    const Square = types.model({
        width: 0,
        height: 0
    })

    const Cube = types.model({
        width: 0,
        height: 0,
        depth: 0
    })

    return { Box, Square, Cube }
}

test("it should recognize a valid snapshot", (t) => {
    const { Box } = createTestFactories()

    t.deepEqual(Box.is({ width: 1, height: 2 }), true)
})

test("it should recognize an invalid snapshot", (t) => {
    const { Box } = createTestFactories()

    t.deepEqual(Box.is({ width: 1, height: 2, depth: 3 }), false)
})

test("it should check valid nodes as well", (t) => {
    const { Box } = createTestFactories()

    const doc = Box.create()

    t.deepEqual(Box.is(doc), true)
})

test("it should check invalid nodes as well", (t) => {
    const { Box, Cube } = createTestFactories()

    const doc = Cube.create()

    t.deepEqual(Box.is(doc), false)
})

test("it should cast different compatible factories", (t) => {
    const { Box, Square } = createTestFactories()

    const doc = Square.create()

    t.deepEqual(Box.is(doc), true)
})

test("it should do typescript type inference correctly", (t) => {
    debugger
    const A = types.model({
        x: types.number,
        y: types.maybe(types.string),
        method() {},
        get z(): string { return "hi" },
        set z(v: string) { }
    })

    // factory is invokable
    const a = A.create({ x: 2, y: "7"})

    // property can be used as proper type
    const z: number = a.x

    // property can be assigned to crrectly
    a.x = 7

    // wrong type cannot be assigned
    // MANUAL TEST: not ok: a.x = "stuff"

    // sub factories work
    const B = types.model({
        sub: types.maybe(A)
    })

    const b = B.create()

    // sub fields can be reassigned
    b.sub = A.create({
        // MANUAL TEST not ok: z: 4
        x: 3
    })

    // sub fields have proper type
    b.sub.x = 4
    const d: string = b.sub.y!

    a.y = null // TODO: enable strict null checks and verify this

    const zz: string = a.z
    a.z = "test"

    b.sub.method()
})
