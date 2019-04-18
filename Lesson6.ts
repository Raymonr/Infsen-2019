import * as Immutable from "immutable"

interface Fun<a, b> {
  f: (_: a) => b
  then: <c>(g: Fun<b, c>) => Fun<a, c>
}

let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => {
  return {
    f: f,
    then: function<c>(g: Fun<b, c>): Fun<a, c> {
      return Fun<a, c>((x: a) => g.f(this.f(x)))
    }
  }
}

type Either<a, b> = {
  kind: "left",
  value: a
} | {
  kind: "right",
  value: b
}

let inl = <a, b>(): Fun<a, Either<a, b>> => {
  return Fun<a, Either<a, b>>((x: a) => {
    return {
    kind: "left",
    value: x
  }})
}

let inr = <a, b>(): Fun<b, Either<a, b>> => {
  return Fun<b, Either<a, b>>((x: b) => {
    return {
    kind: "right",
    value: x
  }})
}

let map_Either = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): 
  Fun<Either<a, b>, Either<a1, b1>> => {
    return Fun((e: Either<a, b>): Either<a1, b1> => {
      if (e.kind == "left") {
        let newValue = f.f(e.value)
        return inl<a1, b1>().f(newValue)
      }
      else {
        let newValue = g.f(e.value)
        return inr<a1, b1>().f(newValue)
      }
    })
}

type Unit = {}

// (Either Unit) a
type Option<a> = Either<Unit, a>

let id = <a>(): Fun<a, a> => Fun((x: a) => x)

let map_Option = <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> => {
  return map_Either<Unit, Unit, a, b>(id<Unit>(), f)
}

let unit_Option = <a>(): Fun<a, Option<a>> => inr() 

let join_Option = <a>(): Fun<Option<Option<a>>, Option<a>> => {
  return Fun<Option<Option<a>>, Option<a>>((opt: Option<Option<a>>): Option<a> => {
    if (opt.kind == "left") {
      return inl<Unit, a>().f({})
    }
    else {
      return opt.value
    }
  })
}

interface Pair<a, b> {
  fst: a
  snd: b 
}

let Pair = <a, b>(x: a, y: b): Pair<a, b> => {
  return {
    fst: x,
    snd: y
  }
}

let map_Pair = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): 
  Fun<Pair<a, b>, Pair<a1, b1>> => {
    return Fun((p: Pair<a, b>) => {
      return Pair<a1, b1>(f.f(p.fst), g.f(p.snd))
    })
  }

// (State s) a
type State<s, a> = Fun<s, Pair<a, s>>

let map_State = <s, a, b>(f: Fun<a, b>): Fun<State<s, a>, State<s, b>> => {
  return Fun<State<s, a>, State<s, b>>((p: State<s, a>) => {
    return p.then(map_Pair(f, id<s>()))
  })
}

//unit_Functor = <a>(): Fun<a, Functor<a>>
/*let unit_State : ('a, State<'a, s>) =
    fun x ->
    fun s -> (x, s) 
*/
let unit_State = <s, a>(): Fun<a, State<s, a>> => {
  return Fun<a, State<s, a>>((x: a) => {
    return Fun<s, Pair<a, s>>((state: s) => {
      return Pair(x, state)
    })
  })
}

//let join_Functor = <a>(): Fun<Functor<Functor<a>>, Functor<a>>
// let join_State = <s, a>(): Fun<State<s, State<s, a>>, State<s, a>> => {
//   return Fun<State<s, State<s, a>>, State<s, a>>((p: State<s, State<s, a>>) => {
//     let stateExec = p.f
//   })
// }

let testEither = (): Either<number, string> => inl<number, string>().f(5)
let testEither2 = (): Either<number, string> => inr<number, string>().f("Hello world!")

console.log(testEither())
console.log(testEither2())