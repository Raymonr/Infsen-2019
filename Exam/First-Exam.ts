import * as Immutable from "immutable"

//exercise 1
interface Fun<a, b> {
  f: ((_: a) => b)
  then: <c>(g: Fun<b, c>) => Fun<a, c>
}

let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => {
  return {
    f: f,
    then: function <c>(g: Fun<b, c>): Fun<a, c> {
      //TODO 1
      return Fun<a,c>((x) => g.f(f(x)))
    }
  }
}

//exercise 2
interface Pair<a, b> {
  fst: a
  snd: b
}

let map_Pair = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Pair<a, b>, Pair<a1, b1>> => {
  return Fun((p: Pair<a, b>) => {
    //TODO 2
    return null!
  })
}

//exercise 3
type Fun_n<a> = Fun<number, a>

let map_Fun_n = <a, b>(g: Fun<a, b>): Fun<Fun_n<a>, Fun_n<b>> => Fun((f: Fun_n<a>) => f.then(g))

let unit_Fun_n = <a>(): Fun<a, Fun_n<a>> => Fun((x: a) => Fun((_: number) => x))

let join_Fun_n = <a>(): Fun<Fun_n<Fun_n<a>>, Fun_n<a>> => {
  //Todo uncomment and remove return null!
  return null!
  // return Fun((f: Fun_n<Fun_n<a>>) => Fun((i: number) => 
  // TODO 3
  // )
}

//exercise 4
type Option<a> = ({
  kind: "none"
} | {
  kind: "some"
  value: a
}) & ({
  then: <b>(f: Fun<a, Option<b>>) => Option<b>
})

let None = <a>(): Option<a> => {
  return {
    kind: "none",
    then: function <b>(f: Fun<a, Option<b>>): Option<b> {
      return bind_Option(this, f)
    }
  }
}

let Some = <a>(v: a): Option<a> => {
  return {
    kind: "some",
    value: v,
    then: function <b>(f: Fun<a, Option<b>>): Option<b> {
      return bind_Option(this, f)
    }
  }
}

let map_Option = <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> => {
  return Fun((opt: Option<a>) => {
    if (opt.kind == "none") {
      return None<b>()
    }
    else {
      return Some<b>(f.f(opt.value))
    }
  })
}

let unit_Option = <a>(): Fun<a, Option<a>> => {
  return Fun((x: a) => Some<a>(x))
}

let join_Option = <a>(): Fun<Option<Option<a>>, Option<a>> => {
  //Todo uncomment and remove return null!
  return null!
  // return Fun((opt: Option<Option<a>>) => {
  //   if (opt.kind == "none") {
  //     //TODO 4
  //   }
  //   else {
  //     //TODO 5
  //   }
  // })
}

let bind_Option = <a, b>(opt: Option<a>, f: Fun<a, Option<b>>): Option<b> => {
  return map_Option(f).then(join_Option()).f(opt)
}

//exercise 5
type Unit = {}

let Pair = function <a, b>(x: a, y: b): Pair<a, b> {
  return { fst: x, snd: y }
}

let id = function <a>(): Fun<a, a> { return Fun<a, a>((x: a) => x) }

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


let initMemory = (): Statement<Unit> => {
  //TODO 6
  return null!
}

let printMemory = Fun<Memory, string>((m: Memory) => {
  let s = "{ "
  m.forEach(x => (x == undefined) ? "" : s += x + " ")
  return s + "}"
})

console.log(initMemory().run.f(Immutable.Map()))