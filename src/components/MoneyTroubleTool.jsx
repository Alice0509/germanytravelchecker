import { useEffect, useMemo, useRef, useState } from "react";
import {
  getMoneyTroubleFlow,
  moneyTroubleFlows,
} from "../data/moneyTroubleFlows.js";

function readInitialSelection() {
  const params = new URLSearchParams(window.location.search);
  const issueId = params.get("issue");
  const detailId = params.get("detail");
  const flow = getMoneyTroubleFlow(issueId);

  if (!flow) {
    return { issueId: null, detailId: null };
  }

  const validDetail = flow.options.some((option) => option.id === detailId);

  return {
    issueId: flow.id,
    detailId: validDetail ? detailId : null,
  };
}

function updateAddress(issueId, detailId) {
  const url = new URL(window.location.href);

  if (issueId) {
    url.searchParams.set("issue", issueId);
  } else {
    url.searchParams.delete("issue");
  }

  if (detailId) {
    url.searchParams.set("detail", detailId);
  } else {
    url.searchParams.delete("detail");
  }

  window.history.replaceState(null, "", `${url.pathname}${url.search}#money-tool`);
}

export default function MoneyTroubleTool() {
  const initial = useMemo(readInitialSelection, []);
  const [issueId, setIssueId] = useState(initial.issueId);
  const [detailId, setDetailId] = useState(initial.detailId);
  const [status, setStatus] = useState("");
  const resultRef = useRef(null);

  const selectedFlow = getMoneyTroubleFlow(issueId);
  const selectedOption =
    selectedFlow?.options.find((option) => option.id === detailId) || null;
  const result = selectedOption?.result || null;

  useEffect(() => {
    if (!initial.issueId) return undefined;

    const timer = window.setTimeout(() => {
      document.getElementById("money-tool")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [initial.issueId]);

  useEffect(() => {
    if (!result) return undefined;

    const timer = window.setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [result]);

  function chooseIssue(nextIssueId) {
    setIssueId(nextIssueId);
    setDetailId(null);
    setStatus("");
    updateAddress(nextIssueId, null);
  }

  function chooseDetail(nextDetailId) {
    setDetailId(nextDetailId);
    setStatus("");
    updateAddress(issueId, nextDetailId);
  }

  function goBack() {
    setDetailId(null);
    setStatus("");
    updateAddress(issueId, null);
  }

  function startOver() {
    setIssueId(null);
    setDetailId(null);
    setStatus("");
    updateAddress(null, null);

    window.setTimeout(() => {
      document.getElementById("money-tool")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  async function copyPhrase() {
    if (!result?.phrase) return;

    const text = `${result.phrase.german}\n${result.phrase.english}`;

    try {
      await navigator.clipboard.writeText(text);
      setStatus("German phrase copied.");
    } catch {
      setStatus("Copy failed. Press and hold the German phrase to copy it.");
    }
  }

  function openReference() {
    const reference = document.getElementById("money-reference");

    if (!reference) return;

    reference.open = true;

    window.setTimeout(() => {
      reference.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  async function shareResult() {
    const shareData = {
      title: result?.title || "Germany payment trouble help",
      text: result?.title || "Germany payment trouble help",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setStatus("Result shared.");
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setStatus("Result link copied.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        setStatus("Sharing failed. Copy the address from your browser.");
      }
    }
  }

  return (
    <section className="money-tool" aria-labelledby="money-tool-title">
      <header className="money-tool-header">
        <div>
          <p className="money-tool-kicker">Interactive payment help</p>
          <h2 id="money-tool-title">
            {selectedFlow ? selectedFlow.title : "What happened?"}
          </h2>
          <p>
            {selectedFlow
              ? selectedFlow.question
              : "Choose the closest situation. No bank details or personal information are required."}
          </p>
        </div>

        <div className="money-tool-progress" aria-label="Progress">
          <span className="active">1. Problem</span>
          <span className={selectedFlow ? "active" : ""}>2. Detail</span>
          <span className={result ? "active" : ""}>3. Next move</span>
        </div>
      </header>

      {!selectedFlow && (
        <div className="money-issue-grid">
          {moneyTroubleFlows.map((flow) => (
            <button
              className="money-issue-button"
              type="button"
              key={flow.id}
              onClick={() => chooseIssue(flow.id)}
            >
              <strong>{flow.label}</strong>
              <span>{flow.teaser}</span>
              <b>Choose →</b>
            </button>
          ))}
        </div>
      )}

      {selectedFlow && !result && (
        <>
          <div className="money-tool-selection-bar">
            <button type="button" onClick={startOver}>
              ← Change problem
            </button>
            <span>{selectedFlow.label}</span>
          </div>

          <div className="money-detail-grid">
            {selectedFlow.options.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => chooseDetail(option.id)}
              >
                <strong>{option.label}</strong>
                <span>Show the next move →</span>
              </button>
            ))}
          </div>
        </>
      )}

      {result && (
        <article className="money-result" ref={resultRef} aria-live="polite">
          <div className="money-result-topbar">
            <button type="button" onClick={goBack}>
              ← Change detail
            </button>
            <button type="button" onClick={startOver}>
              Start over
            </button>
          </div>

          <header className="money-result-heading">
            <p className="money-result-label">Do this now</p>
            <h3>{result.title}</h3>
          </header>

          <ol className="money-now-list">
            {result.now.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="money-result-grid">
            <section>
              <h4>What it probably means</h4>
              <p>{result.meaning}</p>
            </section>

            <section>
              <h4>Avoid this</h4>
              <ul>
                {result.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h4>Verify here</h4>
              <ul>
                {result.verify.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="money-phrase-card">
            <div>
              <span>Show or say this</span>
              <strong lang="de">{result.phrase.german}</strong>
              <p>{result.phrase.english}</p>
            </div>

            <button type="button" onClick={copyPhrase}>
              Copy phrase
            </button>
          </section>

          <div className="money-result-actions">
            <button type="button" onClick={shareResult}>
              Share this result
            </button>
            <button type="button" onClick={openReference}>
              Open full reference
            </button>
          </div>

          <p className="money-tool-status" role="status">
            {status}
          </p>
        </article>
      )}
    </section>
  );
}
