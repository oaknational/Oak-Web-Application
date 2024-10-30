# `<FocusWrap/>`
Container that has events for when you reach the first/last focusable element in a container.


## Example
Some example logic of wrapping focus within a container. Although this component is most useful when dealing with multi-modal focus states   

```tsx
function Example () {
    const startRef = useRef<HTMLButtonElement>(null)
    const endRef = useRef<HTMLButtonElement>(null)
    const onWrapStart = () => endRef.current?.focus();
    const onWrapEnd = () => startRef.current?.focus();

    return (
        <FocusWrap onWrapStart={onWrapStart} onWrapEnd={onWrapEnd}>
            <button ref={startRef}>one</button>
            <button>two</button>
            <button ref={endRef}>three</button>
        </FocusWrap>
    );
}
```