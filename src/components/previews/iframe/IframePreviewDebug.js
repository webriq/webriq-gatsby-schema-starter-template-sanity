/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state */
import React, { createRef } from "react";
import PropTypes from "prop-types";
import styles from "./IframePreview.css";
import axios from "axios";
import client from "part:@sanity/base/client";

class IframePreview extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    document: null,
  };

  iframeEl = createRef();

  state = {
    hasCheckedActiveSession: false,
    hasActiveSession: false,
    isCreating: true,
    isInitializing: false,
    hasLoaded: false,
    url: "",
    error: false,
    message: "",
  };

  _determinePreviewUrl() {
    return axios
      .get(
        (process.env.SANITY_STUDIO_GET_SITE_PREVIEW_DETAILS ||
          "https://app.webriq.com/api/cms") +
          `?provider_id=${client.config().projectId}`,
        {
          headers: {
            Accept: "application/vnd.webriq.v2+json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length === 0) {
          return null;
        }

        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _startSandbox(data) {
    return axios.post(
      process.env.SANITY_STUDIO_START_SANDBOX_URL ||
        "https://yskeo5mgc0.execute-api.us-west-2.amazonaws.com/dev/startSandbox",
      data
    );
  }

  _checkHasSiteLoaded = (e) => {
    console.log("from iframe", e);

    if (e.data === "WEBRIQ_SITE_HAS_LOADED" && !this.state.hasLoaded) {
      this.setState({ isInitializing: false, hasLoaded: true });
    }
  };

  async componentDidMount__() {
    const sitePreviewDetails = await this._determinePreviewUrl();
    console.log("sitePreviewDetails", sitePreviewDetails);

    if (sitePreviewDetails) {
      try {
        const startSandbox = await this._startSandbox({
          sanity: {
            id: client.config().projectId,
            token: process.env.SANITY_STUDIO_READ_TOKEN,
          },
          sitePreview: sitePreviewDetails.site,
        });
        console.log("startSandbox", startSandbox);

        if (!startSandbox || !startSandbox.data) {
          return this.setState({
            isCreating: false,
            isInitializing: false,
            url: "",
            message: "No preview found for site!",
          });
        }

        this.setState({
          isCreating: false,
          isInitializing: true,
          url: startSandbox.data.url,
        });
      } catch (err) {
        console.log(err);
        this.setState({
          isCreating: false,
          url: "",
          error: err,
        });
      }
    }

    window.addEventListener("message", this._checkHasSiteLoaded, false);
  }

  async componentDidMount() {
    window.addEventListener("message", this._checkHasSiteLoaded, false);
    this.setState({ isCreating: false, isInitializing: true });
  }

  componentWillUnmount() {
    window.removeEventListener("message", this._checkHasSiteLoaded, false);
  }

  render() {
    const { isCreating, error, isInitializing, hasLoaded } = this.state;
    // const { isCreating, error, isInitializing, hasLoaded, url } = this.state;
    const { displayed } = this.props.document;
    const { options } = this.props;

    let url = "http://localhost:8000";
    let previewUrl = url;

    if (error) {
      return (
        <div className={styles.componentWrapper}>
          <p>{this.state.message || "Error: " + error.msg || error.message}</p>
        </div>
      );
    }

    if (isCreating) {
      return (
        <div className={styles.componentWrapper}>
          <p>Creating site preview...</p>
        </div>
      );
    }

    if (hasLoaded) {
      previewUrl = `${url}/${
        displayed._type === "page"
          ? displayed._id.split(".").pop()
          : displayed.slug.current
      }`;
    }

    return (
      <div className={styles.componentWrapper}>
        {isInitializing && <p>Preparing site preview...</p>}
        <div
          className={
            isInitializing
              ? styles.iframeContainerHidden
              : styles.iframeContainer
          }
        >
          <iframe src={previewUrl} frameBorder={"0"} ref={this.iframeEl} />
        </div>
      </div>
    );
  }
}

export default IframePreview;
