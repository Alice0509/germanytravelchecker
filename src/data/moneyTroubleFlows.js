export const moneyTroubleFlows = [
  {
    id: "cash-only",
    label: "Cash only or Girocard",
    title: "The place will not accept your payment method",
    teaser: "Cash-only signs, Girocard-only terminals or no nearby cash.",
    question: "What does the place appear to accept?",
    options: [
      {
        id: "cash-only-sign",
        label: "The sign says cash only",
        result: {
          title: "Use cash or confirm an alternative before ordering",
          now: [
            "Look for Nur Barzahlung, which means cash payment only.",
            "Ask before ordering whether another payment method is possible.",
            "Keep the receipt if you withdraw cash specifically for this purchase.",
          ],
          meaning:
            "The business may have chosen not to accept cards. A visible terminal elsewhere does not mean this checkout accepts your card.",
          avoid: [
            "Do not keep trying the same card when the business has already said cash only.",
            "Do not assume every nearby ATM has the same fees.",
          ],
          verify: [
            "Entrance, menu or checkout payment sign",
            "Staff at the business",
            "ATM operator fee screen before withdrawal",
          ],
          phrase: {
            german: "Kann ich anders bezahlen, oder ist nur Barzahlung möglich?",
            english: "Can I pay another way, or is cash the only option?",
          },
        },
      },
      {
        id: "girocard-only",
        label: "It says Girocard or EC-Karte",
        result: {
          title: "Ask whether your specific card network is accepted",
          now: [
            "Check for Visa, Mastercard, debit or contactless logos.",
            "Ask whether your card can be used before trying repeatedly.",
            "Use cash or another card if the terminal supports fewer networks.",
          ],
          meaning:
            "Girocard is the German debit-card system. EC-Karte is an older informal term that is still commonly used.",
          avoid: [
            "Do not assume Girocard automatically includes every foreign debit card.",
            "Do not interpret one rejection as proof that your card is blocked.",
          ],
          verify: [
            "Card-network symbols on the terminal",
            "Staff at the business",
            "Your banking app if the card also fails elsewhere",
          ],
          phrase: {
            german: "Akzeptieren Sie Visa oder Mastercard, oder nur Girocard?",
            english: "Do you accept Visa or Mastercard, or only Girocard?",
          },
        },
      },
      {
        id: "need-cash",
        label: "I need cash nearby",
        result: {
          title: "Compare the ATM before you confirm",
          now: [
            "Use a bank-operated ATM when a practical option is nearby.",
            "Read the operator fee and withdrawal amount before confirming.",
            "Check whether the ATM offers euros or conversion into your home currency.",
          ],
          meaning:
            "ATM operator fees and your own card-provider fees are separate. A conveniently located ATM is not necessarily free.",
          avoid: [
            "Do not confirm without reading the fee screen.",
            "Do not withdraw more than you are comfortable carrying.",
          ],
          verify: [
            "ATM operator name",
            "Fee and currency screen",
            "Your card issuer's current withdrawal terms",
          ],
          phrase: {
            german: "Wo ist der nächste Geldautomat?",
            english: "Where is the nearest ATM?",
          },
        },
      },
    ],
  },
  {
    id: "card-declined",
    label: "My card was declined",
    title: "The terminal rejected your card",
    teaser: "Shop, restaurant, ticket machine or repeated card failure.",
    question: "Where did the card fail?",
    options: [
      {
        id: "shop",
        label: "Shop or restaurant",
        result: {
          title: "Try one alternative, then check your account",
          now: [
            "Read the terminal message before trying again.",
            "Insert the card if contactless payment failed.",
            "Try a second card or cash, then check your banking app.",
          ],
          meaning:
            "The cause may be the terminal, card network, issuer security check, limit, available balance or connection.",
          avoid: [
            "Do not repeat the same transaction many times without checking.",
            "Do not assume the cashier can see why your bank declined it.",
          ],
          verify: [
            "Terminal message or error receipt",
            "Pending transactions and security alerts",
            "Card issuer if the card fails at unrelated businesses",
          ],
          phrase: {
            german: "Meine Karte wurde abgelehnt. Kann ich anders bezahlen?",
            english: "My card was declined. Can I pay another way?",
          },
        },
      },
      {
        id: "ticket-machine",
        label: "Ticket machine",
        result: {
          title: "Confirm whether a ticket was actually issued",
          now: [
            "Check the machine screen and ticket slot.",
            "Look in the transport app before paying a second time.",
            "Use another supported method, machine or staffed sales point.",
          ],
          meaning:
            "A failed payment attempt is not a valid ticket. A pending bank transaction also does not prove that a ticket was issued.",
          avoid: [
            "Do not board based only on a failed payment attempt.",
            "Do not immediately pay again without checking for a ticket or pending charge.",
          ],
          verify: [
            "Printed ticket or active app ticket",
            "Machine error receipt or reference number",
            "Transport staff or official sales point",
          ],
          phrase: {
            german: "Die Zahlung ist fehlgeschlagen. Wurde ein Ticket ausgestellt?",
            english: "The payment failed. Was a ticket issued?",
          },
        },
      },
      {
        id: "many-places",
        label: "It fails in several places",
        result: {
          title: "Treat this as a possible card or issuer problem",
          now: [
            "Check the banking app for a block, limit or security request.",
            "Use a backup card or cash for immediate needs.",
            "Contact the card issuer using the official number or app.",
          ],
          meaning:
            "Failure at several unrelated terminals makes a card setting, issuer check or account issue more likely, but it still needs confirmation.",
          avoid: [
            "Do not share your PIN, full card details or verification codes with a merchant.",
            "Do not call a phone number supplied by an unknown person.",
          ],
          verify: [
            "Official banking app",
            "Number printed on the card or issuer's official website",
            "Recent pending and completed transactions",
          ],
          phrase: {
            german: "Meine Karte funktioniert gerade nicht. Gibt es eine andere Zahlungsmöglichkeit?",
            english: "My card is not working right now. Is there another way to pay?",
          },
        },
      },
    ],
  },
  {
    id: "atm-conversion",
    label: "ATM or currency conversion",
    title: "The ATM shows fees or your home currency",
    teaser: "Conversion choice, operator fee or cash not dispensed.",
    question: "What is happening at the ATM?",
    options: [
      {
        id: "home-currency",
        label: "It offers my home currency",
        result: {
          title: "Review the conversion before choosing",
          now: [
            "Check whether the amount is shown in euros or your home currency.",
            "Read the displayed exchange markup and total.",
            "Choose euros when you do not want the ATM operator's home-currency conversion.",
          ],
          meaning:
            "The home-currency option is often dynamic currency conversion. Your own provider may still charge separate foreign-use fees.",
          avoid: [
            "Do not assume a familiar home-currency amount is automatically cheaper.",
            "Do not confuse the ATM conversion with your card issuer's fees.",
          ],
          verify: [
            "Currency and markup shown on screen",
            "ATM operator fee",
            "Your issuer's foreign-use terms",
          ],
          phrase: {
            german: "Ich möchte die Auszahlung in Euro, ohne Umrechnung.",
            english: "I want the withdrawal in euros, without conversion.",
          },
        },
      },
      {
        id: "operator-fee",
        label: "It shows an ATM fee",
        result: {
          title: "Decide before confirming the withdrawal",
          now: [
            "Read the exact operator fee and total withdrawal.",
            "Cancel safely if the fee is not acceptable.",
            "Compare another ATM when doing so is practical and safe.",
          ],
          meaning:
            "The fee shown by the ATM operator may be charged in addition to fees from your own card provider.",
          avoid: [
            "Do not assume cancelling after the final confirmation is possible.",
            "Do not reveal your PIN to anyone offering help.",
          ],
          verify: [
            "Final confirmation screen",
            "ATM operator name",
            "Your own bank's withdrawal conditions",
          ],
          phrase: {
            german: "Welche Gebühr wird für diese Abhebung berechnet?",
            english: "What fee is charged for this withdrawal?",
          },
        },
      },
      {
        id: "no-cash",
        label: "No cash came out",
        result: {
          title: "Check whether your account was charged",
          now: [
            "Keep any error receipt and note the ATM location and time.",
            "Check your banking app for a pending or completed withdrawal.",
            "Contact the ATM operator and your card issuer through official channels.",
          ],
          meaning:
            "The withdrawal may have failed completely, or the amount may temporarily appear as pending even though no cash was dispensed.",
          avoid: [
            "Do not leave without recording the ATM identity and location.",
            "Do not accept help that requires sharing your PIN or card credentials.",
          ],
          verify: [
            "Banking app transaction status",
            "ATM reference or error receipt",
            "Official ATM operator and card issuer",
          ],
          phrase: {
            german: "Der Geldautomat hat kein Bargeld ausgegeben. Wurde mein Konto belastet?",
            english: "The ATM did not dispense cash. Was my account charged?",
          },
        },
      },
    ],
  },
  {
    id: "hotel-hold",
    label: "Hotel card hold",
    title: "The hotel reserved or charged extra money",
    teaser: "Deposit, pre-authorisation or a possible duplicate amount.",
    question: "What do you see in your account?",
    options: [
      {
        id: "pending-hold",
        label: "A pending reserved amount",
        result: {
          title: "Ask what the hold covers and when it should be released",
          now: [
            "Ask whether it is a deposit or pre-authorisation.",
            "Confirm the amount and what it covers.",
            "Keep the check-in document and final invoice.",
          ],
          meaning:
            "A pre-authorisation can reduce your available balance without being the final room charge.",
          avoid: [
            "Do not assume every pending amount is a completed charge.",
            "Do not ignore the effect a debit-card hold has on travel funds.",
          ],
          verify: [
            "Hotel check-in document",
            "Pending versus completed status in the banking app",
            "Hotel's stated release process",
          ],
          phrase: {
            german: "Ist das eine Vorautorisierung oder eine endgültige Belastung?",
            english: "Is this a pre-authorisation or a final charge?",
          },
        },
      },
      {
        id: "hold-and-charge",
        label: "The hold and final charge both appear",
        result: {
          title: "Ask the hotel to identify both amounts",
          now: [
            "Compare the final invoice with both banking entries.",
            "Ask whether the reserved amount has already been released.",
            "Contact the issuer if the hotel confirms release but the hold remains.",
          ],
          meaning:
            "The final payment and temporary hold can appear together until the release is processed by the involved payment providers.",
          avoid: [
            "Do not dispute the wrong entry before identifying which is pending.",
            "Do not discard the hotel invoice.",
          ],
          verify: [
            "Final hotel invoice",
            "Pending and completed transaction labels",
            "Hotel and card issuer",
          ],
          phrase: {
            german: "Warum sehe ich die Reservierung und die endgültige Zahlung gleichzeitig?",
            english: "Why do I see the hold and the final payment at the same time?",
          },
        },
      },
      {
        id: "unknown-charge",
        label: "An unexpected completed charge",
        result: {
          title: "Ask for an itemised explanation first",
          now: [
            "Compare the amount with the room invoice and agreed extras.",
            "Ask the hotel for an itemised receipt.",
            "Contact the issuer if the hotel cannot explain the completed charge.",
          ],
          meaning:
            "A completed charge may relate to the room, extras, damage deposit or an error. The description in the banking app may be abbreviated.",
          avoid: [
            "Do not send full card details by ordinary email.",
            "Do not rely only on the shortened banking description.",
          ],
          verify: [
            "Itemised hotel invoice",
            "Booking and check-in terms",
            "Hotel finance desk and card issuer",
          ],
          phrase: {
            german: "Können Sie mir diese Belastung bitte genau erklären?",
            english: "Could you please explain this charge in detail?",
          },
        },
      },
    ],
  },
  {
    id: "ticket-machine",
    label: "Ticket machine payment",
    title: "A ticket machine will not complete the purchase",
    teaser: "Rejected payment, money taken or a machine that appears broken.",
    question: "What happened at the machine?",
    options: [
      {
        id: "payment-rejected",
        label: "The payment was rejected",
        result: {
          title: "Use another official purchase method",
          now: [
            "Check which payment symbols the exact machine displays.",
            "Try another supported method or the operator's official app.",
            "Use another machine or staffed sales point where available.",
          ],
          meaning:
            "Machines can support different cards, cash denominations or contactless methods.",
          avoid: [
            "Do not assume a failed attempt created a ticket.",
            "Do not board without confirming a valid ticket.",
          ],
          verify: [
            "Payment symbols on the machine",
            "Official transport app",
            "Printed or digital ticket status",
          ],
          phrase: {
            german: "Der Automat akzeptiert meine Zahlung nicht. Wo kann ich ein Ticket kaufen?",
            english: "The machine will not accept my payment. Where can I buy a ticket?",
          },
        },
      },
      {
        id: "charged-no-ticket",
        label: "Charged, but no ticket appeared",
        result: {
          title: "Record the failure before paying again",
          now: [
            "Check the ticket slot and official app.",
            "Photograph the machine number and keep the receipt.",
            "Ask transport staff whether another ticket is required before boarding.",
          ],
          meaning:
            "A pending payment does not necessarily mean the ticket was issued, but boarding without a valid ticket can still create a problem.",
          avoid: [
            "Do not assume the bank transaction itself is a ticket.",
            "Do not leave without noting the machine identity.",
          ],
          verify: [
            "Active ticket in the app or printed ticket",
            "Machine number and error receipt",
            "Transport operator staff",
          ],
          phrase: {
            german: "Ich wurde belastet, aber der Automat hat kein Ticket ausgegeben.",
            english: "I was charged, but the machine did not issue a ticket.",
          },
        },
      },
      {
        id: "machine-broken",
        label: "The machine appears broken",
        result: {
          title: "Look for another official sales channel",
          now: [
            "Check for another machine, official app or sales point.",
            "Photograph the error screen and machine number.",
            "Ask staff what purchase method is valid for this journey.",
          ],
          meaning:
            "A broken machine may explain the failure, but it does not automatically create permission to travel without a ticket.",
          avoid: [
            "Do not assume a photo alone replaces a ticket.",
            "Do not use an unofficial ticket-selling website.",
          ],
          verify: [
            "Official transport app or website",
            "Station staff",
            "Machine error notice",
          ],
          phrase: {
            german: "Der Fahrkartenautomat ist defekt. Wie kann ich jetzt ein Ticket kaufen?",
            english: "The ticket machine is broken. How can I buy a ticket now?",
          },
        },
      },
    ],
  },
  {
    id: "tipping",
    label: "Tipping at a restaurant",
    title: "You are not sure how to add the tip",
    teaser: "Card, cash or an unclear restaurant bill.",
    question: "How are you paying?",
    options: [
      {
        id: "tip-by-card",
        label: "I am paying by card",
        result: {
          title: "Tell the server the total before payment completes",
          now: [
            "Decide the total amount you want to pay.",
            "Tell the server before the card transaction is completed.",
            "Ask whether the restaurant can add the tip by card.",
          ],
          meaning:
            "Many German restaurants handle card tips through the server rather than through a separate screen after payment.",
          avoid: [
            "Do not assume every terminal shows a tip screen.",
            "Do not feel required to tip when service or the situation does not justify it.",
          ],
          verify: [
            "Restaurant bill",
            "Total shown on the terminal",
            "Server's explanation",
          ],
          phrase: {
            german: "Kann ich das Trinkgeld mit Karte bezahlen?",
            english: "Can I pay the tip by card?",
          },
        },
      },
      {
        id: "tip-in-cash",
        label: "I am paying in cash",
        result: {
          title: "State the total or leave the intended amount",
          now: [
            "Check the bill total first.",
            "Tell the server the total you want to pay when handing over cash.",
            "Ask for change when you do not intend the full amount as a tip.",
          ],
          meaning:
            "It is common to state the rounded total while paying instead of silently leaving money after the server walks away.",
          avoid: [
            "Do not accidentally say stimmt so unless you mean the server should keep the change.",
            "Do not feel pressured into a fixed percentage.",
          ],
          verify: [
            "Bill total",
            "Cash handed over",
            "Change returned",
          ],
          phrase: {
            german: "Machen Sie bitte fünfundzwanzig Euro.",
            english: "Please make it twenty-five euros.",
          },
        },
      },
      {
        id: "bill-unclear",
        label: "The bill or service charge is unclear",
        result: {
          title: "Ask what is already included",
          now: [
            "Check the itemised bill before adding anything.",
            "Ask whether the unclear amount is a service charge or another item.",
            "Pay only after you understand the total.",
          ],
          meaning:
            "An unfamiliar line may be an item, deposit, cover charge or service-related amount. The label needs to be checked rather than guessed.",
          avoid: [
            "Do not add another tip because you assume it is compulsory.",
            "Do not hand over the card before checking the total.",
          ],
          verify: [
            "Itemised restaurant bill",
            "Terminal total",
            "Server or manager",
          ],
          phrase: {
            german: "Ist der Service in diesem Betrag schon enthalten?",
            english: "Is the service already included in this amount?",
          },
        },
      },
    ],
  },
];

export function getMoneyTroubleFlow(flowId) {
  return moneyTroubleFlows.find((flow) => flow.id === flowId) || null;
}
