export const trainTroubleFlows = [
  {
    id: "cancelled",
    label: "My train was cancelled",
    title: "Your train is no longer running",
    teaser: "Zug fällt aus, cancellation or a stop that was removed.",
    question: "What do you need to solve first?",
    options: [
      {
        id: "need-route",
        label: "I need another route now",
        result: {
          title: "Check an official alternative before you board",
          now: [
            "Confirm the cancelled train by train number, not only by destination.",
            "Open the journey in DB Navigator or check the latest station departure board for alternatives.",
            "Before boarding a different train, verify that your ticket can be used on that alternative.",
          ],
          meaning:
            "Fällt aus or Zugausfall means the train is cancelled. The next useful route may be different from the one you originally booked.",
          avoid: [
            "Do not board a random faster train only because it reaches the same city.",
            "Do not rely on an old screenshot of your original connection.",
          ],
          verify: [
            "DB Navigator journey details",
            "Latest station departure board",
            "DB Information, Reisezentrum or train staff if ticket use is unclear",
          ],
          phrase: {
            german: "Mein Zug fällt aus. Welche Verbindung kann ich jetzt nehmen?",
            english: "My train is cancelled. Which connection can I take now?",
          },
        },
      },
      {
        id: "ticket-flexibility",
        label: "Can I take another train?",
        result: {
          title: "Check whether your train-specific restriction changed",
          now: [
            "Open your booked journey and look for information such as Zugbindung aufgehoben.",
            "Check the official passenger-rights information for your ticket and journey.",
            "Ask staff before using a different operator, mandatory-reservation train or clearly different ticket category when unsure.",
          ],
          meaning:
            "A cancellation can change the restrictions on some train-specific tickets, but the exact options depend on the ticket, journey and operators involved.",
          avoid: [
            "Do not assume every German ticket automatically becomes valid on every ICE, IC or other operator.",
            "Do not confuse a suggested alternative route with proof that your ticket is valid on it.",
          ],
          verify: [
            "Your ticket and journey in DB Navigator",
            "Official DB passenger-rights information",
            "DB staff when the alternative is materially different",
          ],
          phrase: {
            german: "Ist meine Zugbindung aufgehoben? Darf ich diesen Zug nehmen?",
            english: "Has my train restriction been lifted? May I take this train?",
          },
        },
      },
      {
        id: "stop-cancelled",
        label: "My stop was cancelled",
        result: {
          title: "Check where the train will actually stop",
          now: [
            "Look for Haltausfall or a message that your station will not be served.",
            "Check whether you should leave at an earlier or later station.",
            "Search the official onward route from that station before travelling past your intended stop.",
          ],
          meaning:
            "The train itself may still run while one or more scheduled stops are cancelled.",
          avoid: [
            "Do not assume a running train will still stop at every station on the original timetable.",
            "Do not wait until after the missed stop to check the replacement route.",
          ],
          verify: [
            "Train stopping pattern in DB Navigator",
            "Platform display and train announcement",
            "Staff if the replacement route is unclear",
          ],
          phrase: {
            german: "Mein Halt fällt aus. Wo soll ich stattdessen aussteigen?",
            english: "My stop is cancelled. Where should I get off instead?",
          },
        },
      },
    ],
  },
  {
    id: "platform-change",
    label: "My platform changed",
    title: "The departure platform changed",
    teaser: "Gleisänderung, conflicting screens or very little transfer time.",
    question: "What is confusing right now?",
    options: [
      {
        id: "board-app-differ",
        label: "The board and app differ",
        result: {
          title: "Match the train number on the newest station information",
          now: [
            "Find your exact train number such as ICE 612, IC 2040 or RE 1.",
            "Compare it with the latest station departure board and platform display.",
            "If the information still conflicts, ask station staff before moving far from the platform area.",
          ],
          meaning:
            "A Gleisänderung can happen shortly before departure, and different screens may refresh at different times.",
          avoid: [
            "Do not follow only the destination city.",
            "Do not use an old screenshot as the final platform confirmation.",
          ],
          verify: [
            "Latest station departure board",
            "Platform display",
            "DB Navigator and station staff",
          ],
          phrase: {
            german: "Von welchem Gleis fährt ICE 612 jetzt ab?",
            english: "Which platform does ICE 612 depart from now?",
          },
        },
      },
      {
        id: "little-time",
        label: "I have very little time",
        result: {
          title: "Confirm first, then move to the new platform",
          now: [
            "Check the train number and new platform before leaving your current area.",
            "Follow the station signs for the confirmed platform.",
            "Once there, check the platform display again before boarding.",
          ],
          meaning:
            "A short transfer feels urgent, but moving to the wrong platform usually costs more time than one quick confirmation.",
          avoid: [
            "Do not run after passengers who may be catching a different train.",
            "Do not board a train solely because it goes in the same general direction.",
          ],
          verify: [
            "Train number",
            "Station departure board",
            "Platform display",
          ],
          phrase: {
            german: "Ist Gleis 8 richtig für meinen Zug?",
            english: "Is platform 8 correct for my train?",
          },
        },
      },
      {
        id: "train-number-unclear",
        label: "I cannot identify my train",
        result: {
          title: "Use the train number as your anchor",
          now: [
            "Open the ticket or journey and find the ICE, IC, EC, RE, RB or S-Bahn number.",
            "Match that number to the station board.",
            "Then confirm destination, departure time and platform.",
          ],
          meaning:
            "Several trains can show similar destinations or intermediate cities, so the destination alone may not uniquely identify your train.",
          avoid: [
            "Do not use only the city name to choose a train.",
            "Do not assume two trains leaving a few minutes apart use the same ticket or route.",
          ],
          verify: [
            "Ticket or saved journey",
            "Station departure board",
            "Train display at the platform",
          ],
          phrase: {
            german: "Ist das der richtige Zug für meine Fahrkarte?",
            english: "Is this the correct train for my ticket?",
          },
        },
      },
    ],
  },
  {
    id: "delay",
    label: "My train is delayed",
    title: "Your journey is running later or differently",
    teaser: "Verspätung, construction, skipped stops or a connection at risk.",
    question: "What is the delay affecting?",
    options: [
      {
        id: "connection-risk",
        label: "My connection is at risk",
        result: {
          title: "Check the whole journey, not only the first delay",
          now: [
            "Check the latest expected arrival time at your interchange station.",
            "Open the onward train and see whether it is still reachable or whether an alternative is shown.",
            "Keep the disruption information if your onward journey is affected.",
          ],
          meaning:
            "A small first delay can create a much larger arrival delay if it causes a missed connection.",
          avoid: [
            "Do not judge the connection only from the original timetable.",
            "Do not leave the train early for an improvised route without checking the official alternatives.",
          ],
          verify: [
            "DB Navigator entire journey",
            "Onboard or station connection information",
            "Staff when the connection or ticket consequence is unclear",
          ],
          phrase: {
            german: "Erreiche ich meinen Anschluss noch?",
            english: "Will I still make my connection?",
          },
        },
      },
      {
        id: "construction",
        label: "I see Bauarbeiten / route change",
        result: {
          title: "Check whether the route, stops or transport mode changed",
          now: [
            "Open your exact train and check its current stopping pattern.",
            "Look for changed departure times, skipped stops, Umleitung or Ersatzverkehr.",
            "If SEV is shown, check where the replacement transport actually departs.",
          ],
          meaning:
            "Bauarbeiten can change more than the travel time. They may alter platforms, stops, routes or part of the trip.",
          avoid: [
            "Do not treat every construction notice as a simple delay.",
            "Do not assume the replacement bus leaves from the train platform.",
          ],
          verify: [
            "Official journey details",
            "Station construction or replacement notices",
            "Local operator or DB information",
          ],
          phrase: {
            german: "Ändert sich wegen der Bauarbeiten meine Verbindung?",
            english: "Does the construction work change my connection?",
          },
        },
      },
      {
        id: "stop-skipped",
        label: "The train may skip my stop",
        result: {
          title: "Confirm the next usable station before you pass yours",
          now: [
            "Look for Haltausfall or a changed stopping pattern.",
            "Check the recommended route to your destination.",
            "Ask staff while you still have time to leave at an earlier station if necessary.",
          ],
          meaning:
            "A delay or disruption can sometimes be accompanied by cancelled stops rather than a complete train cancellation.",
          avoid: [
            "Do not assume the printed timetable is still the stopping pattern.",
            "Do not wait until after your destination has been passed to check.",
          ],
          verify: [
            "Current train stops in DB Navigator",
            "Onboard display and announcements",
            "Train staff",
          ],
          phrase: {
            german: "Hält dieser Zug noch in meinem Zielbahnhof?",
            english: "Does this train still stop at my destination?",
          },
        },
      },
    ],
  },
  {
    id: "missed-connection",
    label: "I missed my connection",
    title: "Your onward train has already left",
    teaser: "Same booking, separate tickets or the last train of the day.",
    question: "Which situation matches your journey?",
    options: [
      {
        id: "same-journey",
        label: "It is one booked rail journey",
        result: {
          title: "Open the journey and check the official onward alternative",
          now: [
            "Keep the original journey open in DB Navigator or your booking.",
            "Check the next connection offered for your destination.",
            "Verify any changed ticket restrictions before boarding when the alternative differs significantly.",
          ],
          meaning:
            "A missed connection caused by rail disruption can affect your onward options and passenger rights when the legs form one covered rail journey.",
          avoid: [
            "Do not buy a second ticket immediately before checking the original journey.",
            "Do not discard the original ticket or disruption evidence.",
          ],
          verify: [
            "Original booking and journey",
            "Official DB passenger-rights information",
            "DB Information or train staff",
          ],
          phrase: {
            german: "Ich habe wegen der Verspätung meinen Anschluss verpasst. Wie komme ich weiter?",
            english: "I missed my connection because of the delay. How do I continue?",
          },
        },
      },
      {
        id: "separate-tickets",
        label: "I used separate tickets",
        result: {
          title: "Check each ticket separately before assuming protection carries over",
          now: [
            "Identify which delayed service belonged to which ticket.",
            "Check the conditions of the onward ticket before taking a later long-distance train.",
            "Ask the relevant operator when a local ticket and long-distance ticket were purchased separately.",
          ],
          meaning:
            "Separate tickets can represent separate transport contracts. A delay on one ticket does not always change the restrictions on another ticket.",
          avoid: [
            "Do not assume a delayed Deutschland-Ticket journey automatically releases a separately booked ICE ticket.",
            "Do not buy an expensive replacement until you understand the onward ticket conditions.",
          ],
          verify: [
            "Both original tickets",
            "DB passenger-rights information",
            "The operator responsible for the onward ticket",
          ],
          phrase: {
            german: "Ich habe zwei separate Fahrkarten. Gilt mein Fernverkehrsticket noch?",
            english: "I have two separate tickets. Is my long-distance ticket still valid?",
          },
        },
      },
      {
        id: "last-train",
        label: "It was my last train",
        result: {
          title: "Check official assistance before arranging an expensive fallback",
          now: [
            "Check whether the operator provides another train, bus or other onward option.",
            "Look for DB Information, train staff or another official contact at the station.",
            "If you must arrange something yourself, read the passenger-rights rules first and keep all receipts.",
          ],
          meaning:
            "Special passenger-rights rules can apply when disruption leaves you stranded, but reimbursement depends on specific conditions.",
          avoid: [
            "Do not assume any taxi or hotel will automatically be reimbursed.",
            "Do not throw away tickets, receipts or disruption evidence.",
          ],
          verify: [
            "Official onward alternatives",
            "DB passenger-rights information",
            "Staff or operator assistance",
          ],
          phrase: {
            german: "Das war meine letzte Verbindung. Welche Möglichkeit habe ich jetzt?",
            english: "That was my last connection. What option do I have now?",
          },
        },
      },
    ],
  },
  {
    id: "sev",
    label: "I see SEV / Ersatzverkehr",
    title: "Part of the rail journey may use replacement transport",
    teaser: "Replacement bus, unclear stop or a connection made slower by SEV.",
    question: "What do you need to find?",
    options: [
      {
        id: "find-stop",
        label: "I cannot find the replacement bus",
        result: {
          title: "Look beyond the normal train platform",
          now: [
            "Follow signs for SEV, Ersatzverkehr or Schienenersatzverkehr.",
            "Check whether the replacement stop is outside the station building.",
            "Confirm the destination or route number before boarding the bus.",
          ],
          meaning:
            "SEV means rail replacement service. The bus stop may be physically separate from the train platforms.",
          avoid: [
            "Do not wait indefinitely on the train platform when a replacement bus is announced.",
            "Do not board the first bus outside the station without checking its route.",
          ],
          verify: [
            "Station SEV signs",
            "Official journey or construction notice",
            "Station or transport staff",
          ],
          phrase: {
            german: "Wo fährt der Schienenersatzverkehr ab?",
            english: "Where does the rail replacement service depart?",
          },
        },
      },
      {
        id: "not-in-app",
        label: "The bus location is unclear",
        result: {
          title: "Use station signs and operator information together",
          now: [
            "Check the disruption details for the affected rail section.",
            "Look for a station map or temporary SEV signs near the exit.",
            "Ask staff which street or stop name is used for the replacement bus.",
          ],
          meaning:
            "A journey planner can show that replacement transport exists without making the physical bus stop obvious.",
          avoid: [
            "Do not assume the normal city-bus stop is automatically the SEV stop.",
            "Do not walk far from the station without checking the stop name.",
          ],
          verify: [
            "Temporary station signage",
            "DB or local operator disruption notice",
            "Staff or information desk",
          ],
          phrase: {
            german: "Wie heißt die Haltestelle für den Ersatzbus?",
            english: "What is the stop called for the replacement bus?",
          },
        },
      },
      {
        id: "tight-connection",
        label: "SEV makes my connection tight",
        result: {
          title: "Recheck the arrival time for the whole journey",
          now: [
            "Check the estimated arrival of the replacement section.",
            "Recheck your onward connection rather than using the original transfer time.",
            "If the connection is lost, switch to the missed-connection flow and verify ticket options.",
          ],
          meaning:
            "Replacement transport can take longer and may stop farther from rail platforms.",
          avoid: [
            "Do not use the original train arrival time for your transfer plan.",
            "Do not assume a short walking transfer from the replacement stop.",
          ],
          verify: [
            "Updated official journey",
            "Replacement route notice",
            "Onward train details",
          ],
          phrase: {
            german: "Reiche ich mit dem Ersatzverkehr noch meinen Anschluss?",
            english: "Will I still make my connection with the replacement service?",
          },
        },
      },
    ],
  },
  {
    id: "ticket-rights",
    label: "Ticket / refund question",
    title: "The disruption may affect your ticket or passenger rights",
    teaser: "Zugbindung aufgehoben, compensation or separate D-Ticket travel.",
    question: "Which question do you have?",
    options: [
      {
        id: "zugbindung",
        label: "It says Zugbindung aufgehoben",
        result: {
          title: "Your train-specific restriction may no longer apply",
          now: [
            "Keep your original ticket.",
            "Check the alternative journey shown by DB and the passenger-rights information.",
            "Verify special cases such as international travel, reservation-required trains or different operators.",
          ],
          meaning:
            "Zugbindung aufgehoben means the train-specific restriction on an affected ticket has been lifted. The exact usable alternatives still depend on the journey and ticket conditions.",
          avoid: [
            "Do not interpret it as unlimited travel on every operator and train.",
            "Do not throw away the original ticket.",
          ],
          verify: [
            "Original ticket",
            "DB Navigator journey message",
            "Official passenger-rights information",
          ],
          phrase: {
            german: "Meine Zugbindung ist aufgehoben. Welche Züge darf ich nutzen?",
            english: "My train restriction has been lifted. Which trains may I use?",
          },
        },
      },
      {
        id: "refund",
        label: "Can I claim a refund or compensation?",
        result: {
          title: "Keep the evidence and check the official claim rules",
          now: [
            "Keep the ticket, booking reference and disruption details.",
            "Keep receipts for additional costs that may be relevant.",
            "Use the official passenger-rights page or DB Navigator claim process to check eligibility.",
          ],
          meaning:
            "Compensation and reimbursement depend on the final delay, journey, ticket and type of additional cost.",
          avoid: [
            "Do not assume every delay produces the same compensation.",
            "Do not discard receipts before the claim is resolved.",
          ],
          verify: [
            "Actual arrival time at the ticketed destination",
            "Original ticket and booking",
            "Official DB passenger-rights claim information",
          ],
          phrase: {
            german: "Wie kann ich meine Fahrgastrechte geltend machen?",
            english: "How can I make a passenger-rights claim?",
          },
        },
      },
      {
        id: "dticket-long-distance",
        label: "Deutschland-Ticket + ICE / IC",
        result: {
          title: "Treat separately purchased local and long-distance tickets carefully",
          now: [
            "Check whether the local journey and long-distance journey are on separate tickets.",
            "Open the long-distance ticket and verify whether its train restriction changed.",
            "Ask DB staff before taking a later ICE or IC if the local delay caused the missed train.",
          ],
          meaning:
            "A Deutschland-Ticket used for the feeder journey and a separately purchased long-distance ticket can be treated as separate transport contracts.",
          avoid: [
            "Do not assume the Deutschland-Ticket delay automatically makes a separate Sparpreis ICE ticket flexible.",
            "Do not board a different long-distance train without checking the long-distance ticket conditions.",
          ],
          verify: [
            "Deutschland-Ticket and long-distance ticket separately",
            "DB passenger-rights information",
            "DB staff or Reisezentrum",
          ],
          phrase: {
            german: "Ich habe ein Deutschland-Ticket und ein separates ICE-Ticket. Was gilt jetzt?",
            english: "I have a Deutschland-Ticket and a separate ICE ticket. What applies now?",
          },
        },
      },
    ],
  },
];

export function getTrainTroubleFlow(issueId) {
  return trainTroubleFlows.find((flow) => flow.id === issueId) || null;
}
