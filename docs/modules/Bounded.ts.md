---
title: Bounded.ts
nav_order: 9
parent: Modules
---

# Bounded overview

The `Bounded` type class represents totally ordered types that have an upper and lower boundary.

Instances should satisfy the following law in addition to the `Ord` laws:

- Bounded: `bottom <= a <= top`

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Bounded (interface)](#bounded-interface)
- [boundedNumber](#boundednumber)

---

# Bounded (interface)

**Signature**

```ts
export interface Bounded<A> extends Ord<A> {
  readonly top: A
  readonly bottom: A
}
```

Added in v2.0.0

# boundedNumber

**Signature**

```ts
export declare const boundedNumber: Bounded<number>
```

Added in v2.0.0
