import React from "react";

const ArtistHome = () => (
  <section style={{ maxWidth: "480px", padding: "0 20px" }}>
    <h1>Welcome to the new TeeFury Artist Dashboard</h1>
    <p>
      This is still a work in progress, so we appreciate your patience.
      Currently, you can create new submissions and view sales history as of Jan
      1, 2020. Unfortunately, sales history before Jan 1 is not available. We
      are continuing to enhance the dashboard and will release new features as
      quickly as possible.
    </p>
    <p>Coming Soon:</p>
    <ul>
      <li>Homepage with summary sales numbers</li>
      <li>Improved reporting</li>
      <li>More frequent communication</li>
    </ul>
    <p>
      We are always looking for feedback as well. So if you have any suggestions
      or enhancements, please email us at:
      <a href="mailto:art@teefury.com"> art@teefury.com </a>
    </p>
  </section>
);

export default ArtistHome;
