# useCookieFlag
We want a way to set flags for a user on the server & client. This is for things like when a popup is dismissed

Aims

 - Store as little as possible as the cookies get set on each request
 - Simple react like API
 - Get method on server and client


## Usage
Usage simular to a useState hook

```tsx
import {useCookieFlag} from "@/hooks/useCookieFlag";

function Component () {
    const [bannerDismissed, setBannerDismissed] = useCookieFlag("toolkit-modal-dismissed", {
        flags, // string[] list of flags
        activeFlags, // string[] the server flags
    });

    return (
        <div>
            (!bannerDismissed && <div>
                BANNER
                <button onClick={() => setBannerDismissed(true)}>close</button>
            </div>)
            <p>
                Content
            </p>
        </div>
    );
}
```