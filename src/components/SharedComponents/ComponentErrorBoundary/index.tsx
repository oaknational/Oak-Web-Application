import { Component } from "react";

type State = { hasError: boolean };
type Props = { children: React.ReactNode; fallback: React.ReactNode };
export class ComponentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  constructor(props: Props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI

    // TODO: Report error here...
    console.log({ error });

    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // TODO: Report error here...
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    // Return children components in case of no error

    return this.props.children;
  }
}
