import * as Immutable from "immutable"

//exercise 1
interface Fun<a, b> {
    // Todo 1 create identity
    then: <c>(g: Fun<b, c>) => Fun<a, c>
}

let id = <a>(): Fun<a, a> => Fun((x: a) => x)

let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => {
    return {
        then: function <c>(g: Fun<b, c>): Fun<a, c> {
            return Fun<a, c>((x: a) => g.f(this.f(x)))
        }
        // Todo 2 create repeat

        // Todo 3 create repeatUntil
    }
}

//Todo 4
// create incr & double Fun


//exercise 2

//Todo 5 
// create type Option

let None = <a>(): Option<a> => ({ kind: "none" })

let Some = <a>(v: a): Option<a> => ({ kind: "some", value: v })

let map_Option = <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> => {
    //Todo 6
    return null!
}

//exercise 3
//Todo 7 
//create type Either

let inl = <a, b>(): Fun<a, Either<a, b>> => Fun((v: a): Either<a, b> => ({ kind: "left", value: v }))
let inr = <a, b>(): Fun<b, Either<a, b>> => Fun((v: b): Either<a, b> => ({ kind: "right", value: v }))

let map_Either = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Either<a, b>, Either<a1, b1>> => {
    //Todo 8
    return null!
}

let unit_Either = <a, b>(): Fun<b, Either<a, b>> => inr()
let join_Either = <a, b>(): Fun<Either<b, Either<b, a>>, Either<b, a>> => {
    //TODO 9
    return null!
}

//exercise 4
type Id<a> = a

let map_Id = <a, b>(f: Fun<a, b>): Fun<Id<a>, Id<b>> => {
    //TODO 10
    return null!
}
let unit_Id = <a>(): Fun<a, Id<a>> => {
    //TODO 11
    return null!
}
let join_Id = <a>(): Fun<Id<Id<a>>, Id<a>> => {
    //TODO 12
    return null!
}

//exercise 5
//Todo 13
// create interface Pair 


let Pair = <a, b>(x: a, y: b): Pair<a, b> => {
    //Todo 14
    return null!
}

let map_Pair = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Pair<a, b>, Pair<a1, b1>> => {
    //Todo 15
    return null!
}

type State<s, a> = Fun<s, Pair<a, s>>

let map_State = <s, a, b>(f: Fun<a, b>): Fun<State<s, a>, State<s, b>> =>
    Fun((p: State<s, a>) => p.then(map_Pair(f, id<s>())))

let unit_State = <s, a>(): Fun<a, State<s, a>> => Fun((x: a) => Fun((state: s) => Pair(x, state)))

let join_State = <s, a>(): Fun<State<s, State<s, a>>, State<s, a>> => {
    //TODO 16
    return null!
}
