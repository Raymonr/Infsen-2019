//exercise 1
interface Fun<a, b> {
    f: ((_: a) => b)
    then: <c>(g: Fun<b, c>) => Fun<a, c>
    repeat: (n: number) => Fun<a, a>
  }
  
  let id = <a>(): Fun<a, a> => Fun((x: a) => x)
  
  let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => {
    return {
      f: f,
      then: function <c>(g: Fun<b, c>): Fun<a, c> {
        return Fun<a, c>((x: a) => g.f(this.f(x)))
      },
      repeat: function (this: Fun<a, a>, n: number): Fun<a, a> {
        if(n <= 0){
          return Fun<a,a>(this.f)
        } else {
          return Fun<a,a>(this.repeat(n - 1).f)
        }
      }
    }
  }
  
  let incr = Fun<number, number>(x => x + 1)
  console.log(incr.repeat(2).f(10))
  
  //exercise 2
  type Option<a> = {
    kind: "none"
  } | {
    kind: "some"
    value: a
  }
  
  let None = <a>(): Option<a> => ({ kind: "none" })
  
  let Some = <a>(v: a): Option<a> => ({ kind: "some", value: v })
  
  let map_Option = <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> => {
    //Todo uncomment and remove return null!
    // return null!
    return Fun((opt: Option<a>) => {
      // TODO 2
      if (opt.kind == "none") {
        return None<b>()
      }
      else {
        return Some<b>(f.f(opt.value))
      }
    })
  }
  
  //exercise 3
  type Either<a, b> = {
    kind: "left"
    value: a
  } | {
    kind: "right"
    value: b
  }
  
  let inl = <a, b>(): Fun<a, Either<a, b>> => Fun((v: a): Either<a, b> => ({ kind: "left", value: v }))
  let inr = <a, b>(): Fun<b, Either<a, b>> => Fun((v: b): Either<a, b> => ({ kind: "right", value: v }))
  
  let map_Either = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Either<a, b>, Either<a1, b1>> =>
    Fun((e: Either<a, b>): Either<a1, b1> =>
      e.kind == "left" ? f.then(inl<a1, b1>()).f(e.value) : g.then(inr<a1, b1>()).f(e.value))
  
  let unit_Either = <a, b>(): Fun<b, Either<a, b>> => inr()
  let join_Either = <a, b>(): Fun<Either<b, Either<b, a>>, Either<b, a>> => {
    //TODO 3
    let g = (iet: Either<b, Either<b, a>>): Either<b, a> => {
      if(iet.kind == "left"){
        return inl<b,a>().f(iet.value)
      }
      else {
        return iet.value
      }
    }
    return Fun<Either<b, Either<b, a>>, Either<b, a>>(g)!
  }
  
  // console.log(join_Either())
  
  //exercise 4
  type Id<a> = a
  
  let map_Id = <a, b>(f: Fun<a, b>): Fun<Id<a>, Id<b>> => {
    //TODO 4
    return Fun((x:Id<a>) => f.f(x))
  }
  let unit_Id = <a>(): Fun<a, Id<a>> => {
    //TODO 5
    return Fun((x: Id<a>) => x
  }
  let join_Id = <a>(): Fun<Id<Id<a>>, Id<a>> => {
    //TODO 6
    let f = ((x: Id<Id<a>>) : Id<a> => {
      return x
    })
    return Fun<Id<Id<a>>, Id<a>>(f)
  }
  
  //exercise 5
  interface Pair<a, b> {
    fst: a,
    snd: b
  }
  
  let Pair = <a, b>(x: a, y: b): Pair<a, b> => {
    return {
      fst: x,
      snd: y
    }
  }
  
  let map_Pair = <a, a1, b, b1>(f: Fun<a, a1>, g: Fun<b, b1>): Fun<Pair<a, b>, Pair<a1, b1>> => {
    return Fun((p: Pair<a, b>) => {
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
  
  let join_State = <s, a>(): Fun<State<s, State<s, a>>, State<s, a>> => {
    //TODO 7
    // return null!
    return Fun<State<s, State<s, a>>, State<s, a>>((p: State<s, State<s, a>>): State<s, a> => {
      //return null!
    })
  }
  
  let bind_State = <s, a, b>(p: State<s, a>, k: Fun<a, State<s, b>>): State<s, b> =>
    map_State<s, a, State<s, b>>(k).then(join_State<s, b>()).f(p)
  