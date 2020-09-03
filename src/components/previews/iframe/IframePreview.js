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
    isPastAverageBootupTime: false,
    url: "",
    error: false,
    message: "",
  };

  _determinePreviewUrl() {
    return axios
      .get(
        (process.env.SANITY_STUDIO_GET_SITE_PREVIEW_DETAILS ||
          "https://staging.app.webriq.com/api/cms") +
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

  async _createNew({ forceNew = false } = {}) {
    this.setState({
      hasCheckedActiveSession: false,
      hasActiveSession: false,
      isCreating: true,
      isInitializing: false,
      hasLoaded: false,
      isPastAverageBootupTime: false,
      url: "",
      error: false,
      message: "",
    });

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
          forceNew,
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
        console.log("err", err);
        this.setState({
          isCreating: false,
          error: err,
        });
      }
    }
  }

  _handleClickCreateNewOne = (e) => {
    e.preventDefault();
    const q = confirm(
      "The process will take a while. Are you sure you want to create a new one?"
    );
    if (q) {
      this._createNew({ forceNew: true });
    }
  };

  componentDidMount() {
    this._createNew();

    window.addEventListener("message", this._checkHasSiteLoaded, false);
  }

  componentDidUpdate() {
    if (this.state.isInitializing) {
      const FIVE_MINUTES = 5 * 60 * 1000; // ms
      // const FIVE_MINUTES = 5000; // ms
      setTimeout(
        () => this.setState({ isPastAverageBootupTime: true }),
        FIVE_MINUTES
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("message", this._checkHasSiteLoaded, false);
  }

  render() {
    const {
      isCreating,
      error,
      isInitializing,
      isPastAverageBootupTime,
      hasLoaded,
      url,
    } = this.state;
    const { displayed } = this.props.document;
    const { options } = this.props;

    let previewUrl = url;
    console.log("this.state", this.state);
    console.log("render -> previewUrl", previewUrl);

    if (error) {
      return (
        <div className={styles.componentWrapper}>
          <div className={styles.navHeader}>
            Preview encountered an error or not working?{" "}
            <a href="#" onClick={(e) => this._handleClickCreateNewOne(e)}>
              Click here to create a new one.
            </a>
          </div>
          <h3>
            {this.state.message || "Error: " + error.msg || error.message}
          </h3>
        </div>
      );
    }

    if (isCreating) {
      return (
        <div className={styles.componentWrapper}>
          <h3>Creating preview...</h3>
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
        <div className={styles.navHeader}>
          Preview encountered an error or not working?{" "}
          <a href="#" onClick={(e) => this._handleClickCreateNewOne(e)}>
            Click here to create a new one.
          </a>
        </div>
        {isInitializing && <h3>Preparing preview...</h3>}
        {isInitializing && isPastAverageBootupTime && (
          <p>
            <br /> Ooops! This is taking longer than normally expected, it might
            have encountered an error. <br />
            <br />
            You may choose to wait a bit more or you can{" "}
            <a href="#" onClick={(e) => this._handleClickCreateNewOne(e)}>
              click here to create a new one.
            </a>
          </p>
        )}

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
