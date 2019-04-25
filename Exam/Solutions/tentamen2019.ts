import * as Immutable from "immutable"

let c = function(value: any){ return console.log(value)}

//exercise 1
interface Fun<a, b> {
  f: ((_: a) => b)
  then: <c>(this: Fun<a, b>, g: Fun<b, c>) => Fun<a, c>
  repeatUntil: (condition: (_: a) => boolean) => Fun<a, a> //TODO 1.1 Complete the type signature of repeatUntil
  bind: (g: Fun<b, Fun<a, b>>) => Fun<a, b> //TODO 4.1 Complete the type signature bind
}

let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => {
  return {
    f: f,
    then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
      return Fun<a, c>((x: a) => g.f(this.f(x)))
    },
    repeatUntil: function (this: Fun<a, a>, condition: (_: a) => boolean): Fun<a, a> {
      //TODO 1.2 Complete the implementation of repeatUntil
      return Fun((A: a): a => {
        if (condition(A)) {
          return A
        } else {
          return this.then(this.repeatUntil(condition)).f(A)
        }
      })
    },
    bind: function <b1>(this: Fun<a, b>, g: Fun<b, Fun<a, b1>>): Fun<a, b1> {
      //TODO 4.2 Complete the implementation of bind
      return Fun<a, b1>((A: a) => g.f(f(A)).f(A))
    }
  }
}

// Op grandeOmega staat:
// let bind = <a,b>(p:F<a>, q:Fun<a,F<b>>) : F<b> => map_F<a,F<b>>(q).then(join<b>()).f(p)
// let bind = function<a, b>(k: Fun<a, List<b>>): Fun<List<a>,List<b>> {...}


let incr = Fun<number, number>((x) => x + 1)
let dbl = Fun<number, number>((x) => x * 2)
let valueTrue = function(x: number) :  any { x >= 12}

c("TODO 1")
c("repeatUntil: ")
// let valueTrue = Fun((an: number) => an >= 12)
// c(incr.repeatUntil(valueTrue(2)).f(5))


let id = <a>() => Fun<a, a>(x => x)

//exercise 2
type Either<a, b> = {
  kind: "left"
  value: a
} | {
  kind: "right"
  value: b
}

let inl = <a, b>(x: a): Either<a, b> => ({
  kind: "left",
  value: x
})

let inr = <a, b>(x: b): Either<a, b> => ({
  kind: "right",
  value: x
})

let map_Either = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Either<a, b>, Either<a1, b1>> => {
  //TODO 2.1 Complete the implementation of the Either bifunctor
  return Fun((eit: Either<a, b>): Either<a1, b1> => {
    if (eit.kind == "left") {
      return inl<a1, b1>(f.f(eit.value))
    } else {
      return inr<a1, b1>(g.f(eit.value))
    }
  })
}

// how to print map Either
c("\nTODO 2")
c("Map Either left: ")
c(map_Either(incr, dbl).f(inl(2)))
c("Map Either right: ")
c(map_Either(incr, dbl).f(inr(2)))

//exercise 3
type Option<a> = ({
  kind: "none"
} | {
  kind: "some"
  value: a
})

let None = <a>(): Option<a> => ({
  kind: "none"
})

let Some = <a>(v: a): Option<a> => ({
  kind: "some",
  value: v
})

let map_Option = <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> => {
  //TODO 3.1 Complete the implementation of map
  // return Fun((opt: Option<a>): Option<b> => opt.kind == "none" ?  None<b>() : Some<b>(f.f(opt.value)))

  return Fun((opt: Option<a>): Option<b> => {
    if (opt.kind == "none") {
      return None<b>()
    } else {
      return Some<b>(f.f(opt.value))
    }
  })
}

let unit_Option = <a>(): Fun<a, Option<a>> => {
  //TODO 3.2 Complete the implementation of unit
  return Fun((A: a): Option<a> => Some<a>(A))

  // return Fun((a: a): Option<a> => {
  //   return Some<a>(a)
  // })
}

let join_Option = <a>(): Fun<Option<Option<a>>, Option<a>> => {
  //TODO 3.3 Complete the implementation of join
  return Fun((opt: Option<Option<a>>): Option<a> => opt.kind == "none" ? None<a>() : opt.value)
  
  // return Fun((opt: Option<Option<a>>): Option<a> => {
  //   if (opt.kind == "none") {
  //     return None<a>()
  //   } else {
  //     return opt.value
  //   }
  // })
}

// how to print map_Option, unit_Option & join_Option
c("\nTODO 3")
c('Map_Option: ') 
c(map_Option(incr).f(Some(10)))
c('Unit_Option: ') 
c(unit_Option().f(2))
c('Join_Option: ') 
c(join_Option().f(Some(Some(10))))

//exercise 
let map_Fun = <a, b, b1>(g: Fun<b, b1>): Fun<Fun<a, b>, Fun<a, b1>> => Fun((f: Fun<a, b>) => f.then(g))

let unit_Fun = <a, b>(): Fun<b, Fun<a, b>> => Fun((x: b) => Fun((_: a) => x))

let join_Fun = <a, b>(): Fun<Fun<a, Fun<a, b>>, Fun<a, b>> =>
  Fun((f: Fun<a, Fun<a, b>>) => Fun((i: a) => f.f(i).f(i)))

//exercise 5
type Unit = {}

interface Pair<a, b> {
  fst: a
  snd: b
}

let Pair = <a, b>(x: a, y: b): Pair<a, b> => ({
  fst: x,
  snd: y
})

let map_Pair = <a, b, a1, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Pair<a, b>, Pair<a1, b1>> =>
  Fun<Pair<a, b>, Pair<a1, b1>>((p: Pair<a, b>) => Pair(f.f(p.fst), g.f(p.snd)))

interface State<s, a> {
  run: Fun<s, Pair<a, s>>
  then: <b>(k: ((_: a) => State<s, b>)) => State<s, b>
}

let State = <s, a>(): Fun<Fun<s, Pair<a, s>>, State<s, a>> => {
  return Fun((s: Fun<s, Pair<a, s>>): State<s, a> => {
    return {
      run: s,
      then: function <b>(k: ((_: a) => State<s, b>)): State<s, b> {
        return bind_State(this, Fun(k))
      }
    }
  })
}

let map_State = function <s, a, b>(f: Fun<a, b>): Fun<State<s, a>, State<s, b>> {
  return Fun<State<s, a>, State<s, b>>((s: State<s, a>) => {
    let a = s.run.then(map_Pair(f, id<s>()))
    return State<s, b>().f(a)
  })
}

let unit_State = function <s, a>(): Fun<a, State<s, a>> {
  return Fun<a, State<s, a>>((x: a) => {
    return State<s, a>().f(Fun<s, Pair<a, s>>((state: s) => Pair<a, s>(x, state)))
  })
}

let apply = <a, b>(): Fun<Pair<Fun<a, b>, a>, b> => Fun<Pair<Fun<a, b>, a>, b>(fa => fa.fst.f(fa.snd))

let join_State = function <s, a>(): Fun<State<s, State<s, a>>, State<s, a>> {
  return Fun<State<s, State<s, a>>, State<s, a>>((p: State<s, State<s, a>>): State<s, a> => {
    let g = Fun((s: State<s, a>) => s.run)
    return State<s, a>().f(p.run.then(map_Pair(g, id<s>())).then(apply()))
  })
}

let bind_State = function <s, a, b>(m: State<s, a>, k: Fun<a, State<s, b>>): State<s, b> {
  return map_State<s, a, State<s, b>>(k).then(join_State()).f(m)
}

let get_state = function <s>(): State<s, s> {
  return State<s, s>().f(Fun((state: s) => Pair<s, s>(state, state)))
}

let set_state = function <s>(state: s): State<s, Unit> {
  return State<s, Unit>().f(Fun((_: s) => Pair<Unit, s>({}, state)))
}

type Memory = Immutable.Map<string, number>
type Statement<a> = State<Memory, a>

let skip = () => unit_State<Memory, Unit>().f({})

let getVar = (_var: string): Statement<number> => {
  return get_state<Memory>().then((m: Memory) => {
    let x = m.get(_var)
    return unit_State<Memory, number>().f(x)
  })
}

let setVar = (_var: string, value: number): Statement<Unit> => {
  return get_state<Memory>().then((m: Memory) => {
    let m1 = m.set(_var, value)
    return set_state<Memory>(m1)
  })
}


let initMemory = (): Statement<Unit> =>
//TODO 5 Complete the implementation of initMemory
{
  let s1 = setVar("x", 5)
  let s2 = setVar("y", 10)
  return s2
}

let printMemory = Fun<Memory, string>((m: Memory) => {
  let s = "{ "
  m.forEach(x => (x == undefined) ? "" : s += x + " ")
  return s + "}"
})
c("\nTODO 4")
c("Bind: ")

c("\nTODO 5")
c("InitMemory: ")
c(initMemory().run.f(Immutable.Map()))