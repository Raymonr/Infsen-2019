import * as Immutable from "immutable"

//exercise 1
interface Fun<a, b> {
    // Todo 1 create identity
    f: (_: a) => b
    then: <c>(g: Fun<b, c>) => Fun<a, c>
    repeat: (n: number) => Fun<a, a>
    repeatUntil: (p: Fun<a, boolean>) => Fun<a, a>
}

let id = <a>(): Fun<a, a> => Fun((x: a) => x)

let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => {
    return {
        f: f,
        then: function <c>(g: Fun<b, c>): Fun<a, c> {
            return Fun<a, c>((x: a) => g.f(this.f(x)))
        },
        // Todo 2 create repeat
        repeat: function (this: Fun<a, a>, n: number): Fun<a, a> {
            return Fun<a, a>((a: a) => {
                if (n <= 0) {
                    return a
                } else {
                    return this.then(this.repeat(n - 1)).f(a)
                }
            })
        },
        // Todo 3 create repeatUntil
        repeatUntil: function (this: Fun<a, a>, p: Fun<a, boolean>): Fun<a, a> {
            return Fun<a, a>((x: a) => {
                if (p.f(x)) {
                    return x
                } else {
                    return this.then(this.repeatUntil(p)).f(x)
                }
            })
        }
    }
}

//Todo 4
// create incr & double Fun
let inc = Fun<number, number>((x: number) => x + 1)
console.log(inc.repeat(10).f(5))
let trans = Fun<number, boolean>((x: number) => x == 10)
console.log(inc.repeatUntil(trans).f(2))

//exercise 2

//Todo 5 
// create type Option
type Option<a> = { kind: "none" } | { kind: "some", value: a }

let None = <a>(): Option<a> => ({ kind: "none" })

let Some = <a>(v: a): Option<a> => ({ kind: "some", value: v })

let map_Option = <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> => {
    //Todo 6
    return Fun((opt: Option<a>) => {
        if (opt.kind == "none") {
            return None<b>()
        } else {
            return Some<b>(f.f(opt.value))
        }
    })
}

let numStr = Fun<number, string>((x: number) => x.toString())
console.log(map_Option(numStr).f(Some(20)))

//exercise 3
//Todo 7 
//create type Either
type Either<a, b> = { kind: "left", value: a } | { kind: "right", value: b }

let inl = <a, b>(): Fun<a, Either<a, b>> => Fun((v: a): Either<a, b> => ({ kind: "left", value: v }))
let inr = <a, b>(): Fun<b, Either<a, b>> => Fun((v: b): Either<a, b> => ({ kind: "right", value: v }))

let map_Either = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Either<a, b>, Either<a1, b1>> => {
    //Todo 8
    return Fun((eit: Either<a, b>): Either<a1, b1> => {
        if (eit.kind == "left") {
            return f.then(inl<a1, b1>()).f(eit.value)
        } else {
            return g.then(inr<a1, b1>()).f(eit.value)
        }
    })
}

let unit_Either = <a, b>(): Fun<b, Either<a, b>> => inr()
let join_Either = <a, b>(): Fun<Either<b, Either<b, a>>, Either<b, a>> => {
    //TODO 9
    return Fun((eit: Either<b, Either<b, a>>): Either<b,a> => {
        if(eit.kind == "left"){
            return inl<b,a>().f(eit.value)
        } else {
            return eit.value
        }
    }
}

//exercise 4
type Id<a> = a

let map_Id = <a, b>(f: Fun<a, b>): Fun<Id<a>, Id<b>> => {
    //TODO 10
    return Fun((x: Id<a>) => f.f(x))
}
let unit_Id = <a>(): Fun<a, Id<a>> => {
    //TODO 11
    return Fun((x: Id<a>) => x)
}
let join_Id = <a>(): Fun<Id<Id<a>>, Id<a>> => {
    //TODO 12
    return Fun((x: Id<a>) => x)
}

//exercise 5
//Todo 13
// create interface Pair 
interface Pair<a, b> {
    fst: a
    snd: b
}

let Pair = <a, b>(x: a, y: b): Pair<a, b> => {
    //Todo 14
    return { fst: x, snd: y }
}

let map_Pair = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Pair<a, b>, Pair<a1, b1>> => {
    //Todo 15
    return Fun<Pair<a, b>, Pair<a1, b1>>((p: Pair<a, b>) => {
        return {
            fst: f.f(p.fst),
            snd: g.f(p.snd)
        }
    })
}

type State<s, a> = Fun<s, Pair<a, s>>

let map_State = <s, a, b>(f: Fun<a, b>): Fun<State<s, a>, State<s, b>> =>
    Fun((p: State<s, a>) => p.then(map_Pair(f, id<s>())))

let unit_State = <s, a>(): Fun<a, State<s, a>> => Fun((x: a) => Fun((state: s) => Pair(x, state)))

let apply = <a, b>(): Fun<Pair<Fun<a, b>, a>, b> => Fun(fa => fa.fst.f(fa.snd))

let join_State = <s, a>(): Fun<State<s, State<s, a>>, State<s, a>> => {
    //TODO 16
    return Fun<State<s, State<s, a>>, State<s, a>>((p: State<s, State<s, a>>): State<s, a> => {
        return p.then(apply())
    })
}