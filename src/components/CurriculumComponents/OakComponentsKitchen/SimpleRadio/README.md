# SimpleRadio
A hopeful replacement for oak-components radio group/button

The aim here is a simplier accessibility tree, also something that sits inside `<fieldset />` easily.


## API
Just a very light wrapper around basic `<input/>`'s with `useFocusRing()` thrown in for good measure.

```jsx
<RadioGroup
  name="animal"
  onChange={onChange}
  value={"tiger"}
>
  <RadioButton value="bear">Bear</RadioButton>
  <RadioButton value="tiger">Tiger</RadioButton>
  <RadioButton value="crocodile">Crocodile</RadioButton>
</RadioGroup>
```