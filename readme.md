# INF Software Engenering 
Belangrijke onderwerpen
- Functor, monad, monoid.
- Fun (Functie met Map & Identity functor)
- Monad (Functor + FlatMap)

- Concat
- Option (None, some)
- Pair(fst, snd)
- Either (left, right)
- State


## How to start
Om te beginnen run je:

    tsc -w
    node js/lesson1

## Recap basis principe

### Functor
Om functors te begrijpen heb je de kennis nodig van morfisme.  
Morfisme is niets anders dan (f) hoe iets van a -> b transformeert
zie afbeelding voor verduidelijking:

![morfisme](https://wikimedia.org/api/rest_v1/media/math/render/svg/abd1e080abef4bbdab67b43819c6431e7561361c)

Enige voorwaarde is dat elk object een eigen morfisme ID heeft:

![morfismeID](https://wikimedia.org/api/rest_v1/media/math/render/svg/5aa0850863f2ed951c4fcbe8ea0540ee40edfe8d)

Totaal voorbeeld die veel gebruikt wordt bij software engering:

![voorbeeld](https://i.ibb.co/hL51Ms9/200px-Commutative-diagram-for-morphism-svg.png)

*Functor*  
Een functor is een functie die gemaakt is uit een morfisme.

![functor](https://wikimedia.org/api/rest_v1/media/math/render/svg/5f8333109f8b20bbb2db91873adcbd445f7c2181)

Functor doet dus via een morfisme een object transformeren naar een ander object.

### Monad   

Monad is een Functor die als extra functionaliteiten het volgende heeft.  
- unit
- en een flattened (join aka flatmap).

### Monoid
Monoid is een functie die altijd dezelfde uitkomst geeft  
A + (b + c) is hetzelfde als (a + b) + c

#### Map functor
Dit is de uitleg van een map functor:  
![map functor](https://cdn-images-1.medium.com/max/1600/1*NAoX33R1asfD4GpaTqp0-w.png)

### Hoe is een functie opgebouwd
![functie omschreven](https://i.ibb.co/gZnkXy8/functor.gif)


Succes!