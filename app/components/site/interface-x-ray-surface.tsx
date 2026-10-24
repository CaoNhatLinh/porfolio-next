import styles from "./interface-x-ray.module.css";
import type { XRayLayer } from "./interface-x-ray-model";

const deploymentBars = [42, 56, 48, 68, 63, 82, 74, 94];

export function ProductSurface({ copy }: { copy: boolean }) {
  return (
    <div className={styles.productSurface}>
      <ProductNavigation />
      <div className={styles.productContent}>
        <section className={styles.releaseIntro}>
          <p className={styles.productKicker}>Release room / 09</p>
          <h2 className={styles.releaseTitle}>{copy ? "Theo dõi deployment." : "Track deployments."}</h2>
          <p className={styles.releaseSummary}>
            {copy
              ? "Theo dõi phiên bản, trạng thái triển khai và thay đổi gần đây."
              : "Track releases, deployment status, and recent changes."}
          </p>
          <span className={styles.releaseLink}>{copy ? "Xem ghi chú phiên bản" : "Read release notes"} ↗</span>
        </section>
        <DeploymentPanel copy={copy} />
      </div>
      <div className={styles.productStatus}>
        <span className={styles.healthDot} />
        <span>{copy ? "Hệ thống ổn định" : "Production healthy"}</span>
        <span className={styles.statusMeta}>24 deploys / 98% checks / 02 incidents</span>
      </div>
    </div>
  );
}

function ProductNavigation() {
  return (
    <div className={styles.productNav}>
      <strong>kamling / ship</strong>
      <div className={styles.productNavLinks}>
        <span>Overview</span>
        <span>Releases</span>
        <span>Checks</span>
      </div>
      <span className={styles.liveBadge}>Live</span>
    </div>
  );
}

function DeploymentPanel({ copy }: { copy: boolean }) {
  return (
    <section className={styles.deploymentPanel} aria-label={copy ? "Xu hướng triển khai" : "Deployment trend"}>
      <div className={styles.deploymentHeader}>
        <div>
          <p>Deployment confidence</p>
          <strong>98.4%</strong>
        </div>
        <span>Last 30 days</span>
      </div>
      <div className={styles.chart} aria-hidden="true">
        {deploymentBars.map((height, index) => (
          <span key={index} style={{ height: `${height}%` }} />
        ))}
        <i />
      </div>
      <div className={styles.chartLegend}>
        <span>01 Aug</span><span>15 Aug</span><span>30 Aug</span>
      </div>
    </section>
  );
}

export function XRayUnderlay({ layer }: { layer: XRayLayer }) {
  if (layer === "states") return <StateUnderlay />;
  if (layer === "accessibility") return <AccessibilityUnderlay />;
  return <SystemUnderlay />;
}

function SystemUnderlay() {
  return (
    <div className={`${styles.technicalLayer} ${styles.systemLayer}`}>
      <div className={styles.systemNav}><span>nav.product-nav</span><i /></div>
      <div className={styles.systemGrid}>
        <div className={styles.systemIntro}>
          <span>p.eyebrow / 12px</span>
          <strong>h2.release-title</strong>
          <i>max-width: 7ch</i>
          <small>p.release-summary / 1.65</small>
        </div>
        <div className={styles.systemChart}>
          <span>figure.deployments</span>
          <div className={styles.systemColumns}>{Array.from({ length: 8 }).map((_, index) => <i key={index} />)}</div>
        </div>
      </div>
      <div className={styles.systemFooter}>output.health-status / min-height 56px</div>
    </div>
  );
}

function StateUnderlay() {
  return (
    <div className={`${styles.technicalLayer} ${styles.stateLayer}`}>
      <div className={styles.stateNav}>STATE MAP / RELEASE SURFACE</div>
      <div className={styles.stateFlow}>
        <article><span>01</span><strong>Loading</strong><p>Preserve geometry</p></article>
        <article><span>02</span><strong>Error</strong><p>Explain recovery</p></article>
        <article><span>03</span><strong>Ready</strong><p>Confirm in context</p></article>
      </div>
      <div className={styles.stateFooter}>idle → pending → resolved</div>
    </div>
  );
}

function AccessibilityUnderlay() {
  return (
    <div className={`${styles.technicalLayer} ${styles.accessibilityLayer}`}>
      <div className={styles.a11yTree}>
        <span>main “Release room”</span>
        <span>navigation “Product”</span>
        <span>section “Release evidence”</span>
        <span>heading level 2</span>
        <span>figure “Deployment trend”</span>
        <span>status “Production healthy”</span>
      </div>
      <div className={styles.focusPath}>
        <span>01 Navigation</span><i /><span>02 Release notes</span><i /><span>03 Health status</span>
      </div>
    </div>
  );
}
