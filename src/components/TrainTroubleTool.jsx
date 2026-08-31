import { useEffect, useMemo, useRef, useState } from "react";
import {
  getTrainTroubleFlow,
  trainTroubleFlows,
} from "../data/trainTroubleFlows.js";

function readInitialSelection() {
  const params = new URLSearchParams(window.location.search);
  const issueId = params.get("issue");
  const detailId = params.get("detail");
  const flow = getTrainTroubleFlow(issueId);

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

  window.history.replaceState(
    null,
    "",
    `${url.pathname}${url.search}#train-tool`,
  );
}

export default function TrainTroubleTool() {
  const initial = useMemo(readInitialSelection, []);
  const [issueId, setIssueId] = useState(initial.issueId);
  const [detailId, setDetailId] = useState(initial.detailId);
  const [status, setStatus] = useState("");
  const resultRef = useRef(null);

  const selectedFlow = getTrainTroubleFlow(issueId);
  const selectedOption =
    selectedFlow?.options.find((option) => option.id === detailId) || null;
  const result = selectedOption?.result || null;

  useEffect(() => {
    if (!initial.issueId) return undefined;

    const timer = window.setTimeout(() => {
      document.getElementById("train-tool")?.scrollIntoView({
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
      document.getElementById("train-tool")?.scrollIntoView({
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

  async function shareResult() {
    const shareData = {
      title: result?.title || "Germany train trouble help",
      text: result?.title || "Germany train trouble help",
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

  function openReference() {
    const reference = document.getElementById("train-reference");

    if (!reference) return;

    reference.open = true;

    window.setTimeout(() => {
      reference.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  return (
    <section className="train-tool" aria-labelledby="train-tool-title">
      {!result && (
        <header className="train-tool-header">
          <div>
            <p className="train-tool-kicker">Interactive train help</p>
            <h2 id="train-tool-title">
              {selectedFlow ? selectedFlow.title : "What happened?"}
            </h2>
            <p>
              {selectedFlow
                ? selectedFlow.question
                : "Choose the closest situation. Then verify the exact train, platform and ticket with official rail information."}
            </p>
          </div>

          <div className="train-tool-progress" aria-label="Progress">
            <span className="active">1. Problem</span>
            <span className={selectedFlow ? "active" : ""}>2. Detail</span>
            <span>3. Next move</span>
          </div>
        </header>
      )}

      {result && (
        <div className="train-result-context">
          <span>{selectedFlow.label}</span>
          <strong>{selectedOption.label}</strong>
        </div>
      )}

      {!selectedFlow && (
        <div className="train-issue-grid">
          {trainTroubleFlows.map((flow) => (
            <button
              className="train-issue-button"
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
          <div className="train-tool-selection-bar">
            <button type="button" onClick={startOver}>
              ← Change problem
            </button>
            <span>{selectedFlow.label}</span>
          </div>

          <div className="train-detail-grid">
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
        <article className="train-result" ref={resultRef} aria-live="polite">
          <div className="train-result-topbar">
            <button type="button" onClick={goBack}>
              ← Change detail
            </button>
            <button type="button" onClick={startOver}>
              Start over
            </button>
          </div>

          <header className="train-result-heading">
            <p className="train-result-label">Do this now</p>
            <h3>{result.title}</h3>
          </header>

          <ol className="train-now-list">
            {result.now.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="train-result-grid">
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

          <section className="train-phrase-card">
            <div>
              <span>Show or say this</span>
              <strong lang="de">{result.phrase.german}</strong>
              <p>{result.phrase.english}</p>
            </div>

            <button type="button" onClick={copyPhrase}>
              Copy phrase
            </button>
          </section>

          <div className="train-official-links">
            <a
              href="https://int.bahn.de/en"
              target="_blank"
              rel="noreferrer"
            >
              Check journey on Deutsche Bahn ↗
            </a>
            <a
              href="https://int.bahn.de/en/booking-information/passenger-rights"
              target="_blank"
              rel="noreferrer"
            >
              DB passenger rights ↗
            </a>
          </div>

          <div className="train-result-actions">
            <button type="button" onClick={shareResult}>
              Share this result
            </button>
          </div>

          <p className="train-tool-status" role="status">
            {status}
          </p>
        </article>
      )}
    </section>
  );
}
