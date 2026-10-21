import { ArrowLeft, ArrowUpRight } from "lucide-react";
const clauses = [
  [
    "Business, scope and agreement",
    "TorqLab Automotive is operated by 2607521 Alberta Inc., serving Calgary, Alberta. These terms apply to agreed mobile oil-change and brake services. A website visit, estimate or copied quote request is not a booking or authorization. Before work begins, we provide these terms and a job-specific work order for your express approval. Your work order identifies the vehicle, services, parts, price, applicable taxes, warranty terms and any agreed charges. Mandatory legal requirements prevail over conflicting wording.",
  ],
  [
    "Your authority and vehicle information",
    "You must own the vehicle or have authority to approve and pay for its service. Provide accurate vehicle identification, mileage, service history and specifications, and disclose known damage, leaks, warning lights, modifications, locking wheel nuts, wheel keys and relevant safety concerns. We remain responsible for the professional checks reasonably required for our work; customer information does not excuse unsafe or negligent service.",
  ],
  [
    "Estimates, approval and additional work",
    "Website prices are starting estimates in Canadian dollars. The written quote will disclose the service scope, oil quantity and specification, parts, labour, taxes and any travel, disposal or diagnostic charges before approval. No undisclosed charges or additional work will be added without your authorization. If seized components, corrosion, incorrect parts or other conditions change the scope or price, we stop the affected work, explain the change and request approval. If you decline, only previously authorized work and disclosed, agreed charges are payable, subject to applicable law. We record approvals and provide a copy on request.",
  ],
  [
    "Safe location and access",
    "Arrange lawful access and any owner, landlord or condominium permission. Provide a stable, level, adequately lit work area away from moving traffic, with enough space for safe lifting. Keep children, pets and bystanders clear and remove valuables. We may refuse, pause or reschedule unsafe work, adverse-weather work, or work outside our equipment or qualifications. Any proposed charge must have been disclosed and approved in advance. Our responsibility for damage caused by our work is not transferred to you.",
  ],
  [
    "Customer-supplied parts, filters and oil",
    "Supplying products is your voluntary choice. Before installation, you must identify the products, their source and any known defects, and provide accurate compatibility, oil viscosity, approval/specification, quantity and storage information. Products must be lawful and suitable for the vehicle and intended use. We may inspect, request documentation or refuse unsuitable, damaged, suspect, contaminated or incompatible products. We will not knowingly perform unsafe work even if you request it.",
  ],
  [
    "Limits for customer-supplied products",
    "To the extent permitted by law, TorqLab does not provide a product warranty for items it did not sell and is not responsible for their inherent manufacturing defects, counterfeit origin, contamination, prior damage or incorrect specifications not caused by TorqLab. Claims against the product seller or manufacturer remain yours. We do not guarantee that your chosen products will cure an existing fault, meet a manufacturer warranty condition or deliver a particular lifespan. These limits apply only to loss attributable to the supplied product, not to our negligent advice, failure to exercise reasonable care, improper installation, breach of an express promise or any responsibility the law does not allow us to exclude.",
  ],
  [
    "Repeat labour and product failures",
    "If a customer-supplied item fails for reasons not attributable to our work, removal, replacement, diagnosis, towing or repeat attendance is not included in the original labour price unless agreed otherwise. Any new work and charges require a separate approved quote. You are not charged to correct our own defective workmanship where correction is required by law or an applicable warranty. We do not make manufacturer warranty decisions on behalf of the manufacturer.",
  ],
  [
    "Service limits, inspection and testing",
    "Only the work described in the authorized work order is included. An oil change or brake job is not a comprehensive inspection, certification of roadworthiness, collision inspection or guarantee against unrelated failures. We explain significant safety concerns identified during the service. Vehicle movement, diagnostic access and any road test require your authorization and must be lawful and safe. We do not authorize driving an unsafe vehicle. Waste handling follows applicable requirements; any customer request for removed parts must be made before disposal and remains subject to lawful handling and applicable core-return arrangements.",
  ],
  [
    "Customer review and satisfaction at handover",
    "At completion, you are responsible for reviewing the work order and invoice, checking the visible condition of the vehicle, listening to our explanation of completed work and outstanding recommendations, asking questions, and identifying reasonably apparent concerns before departure where practical. You are asked to confirm whether the described work was completed to your satisfaction and to record exceptions. Do not sign an acknowledgement you disagree with. You are not required to perform a technical inspection or discover hidden defects. A signature, payment, departure or failure to raise an immediate concern does not waive statutory rights, latent-defect claims or a valid workmanship claim.",
  ],
  [
    "After-service responsibilities and safety",
    "Follow written manufacturer and service instructions, including any brake bedding or follow-up instructions actually provided. Monitor warning lights, fluid levels and vehicle behaviour as appropriate for your vehicle. If you notice braking problems, a significant leak, an oil-pressure warning or another safety issue, stop using the vehicle when safe and seek appropriate assistance; do not drive merely to obtain a recheck. Notify TorqLab promptly through the contact details supplied on your work order and preserve relevant records and parts where reasonably possible. No arbitrary reporting deadline in these terms extinguishes a legal claim.",
  ],
  [
    "Workmanship, warranties and complaints",
    "We perform authorized services with reasonable care and skill. Any additional commercial warranty must be stated in your work order; these terms do not invent a fixed warranty period or replace protections required by law. For a concern, provide the invoice, symptoms and available supporting information. We will arrange a reasonable assessment and explain proposed remedies. Give us a reasonable opportunity to assess or correct our work where safe and practical, without limiting emergency repairs, independent advice or lawful remedies. Contacting us first is not a prerequisite to contacting a regulator or exercising a legal right.",
  ],
  [
    "Payment, cancellations and refunds",
    "Payment for authorized services is due as agreed in the work order, after an itemized invoice is provided. Accepted methods, deposits and any cancellation or no-access charge must be disclosed before you agree. No cancellation, travel, storage, interest or collection fee arises solely from this page. Refunds, deposits and cancellations are handled under the approved work order and applicable law. If direct-sales, internet-sales or other consumer-contract rules apply, their required disclosures, cancellation notices, cancellation periods and refund rights prevail. Nothing here authorizes work or a deposit before legally required contract steps are completed.",
  ],
  [
    "Responsibility and losses",
    "You remain responsible for loss caused by your own misuse, material misrepresentation, unauthorized subsequent modifications or refusal of clearly explained safety recommendations, to the extent that conduct caused the loss. TorqLab remains responsible for losses for which it is legally liable. Nothing excludes or caps liability for our negligence, defective workmanship, fraud, wilful misconduct, personal injury, property damage or any non-excludable duty. No blanket release, automatic customer indemnity or invoice-value liability cap applies under these terms.",
  ],
  [
    "Records and personal information",
    "We use vehicle, contact, authorization and service records for quoting, performing services, invoicing, resolving concerns and legal recordkeeping, subject to applicable Alberta privacy law. Job documentation should be limited to what is reasonably needed; marketing use of identifiable photos or customer information requires separate appropriate consent. Submitting the quote form sends the contact information, vehicle details, notes and preferred time to the TorqLab server for local storage and response to the request. Email and SMS notifications are not yet configured. A quote request is not a confirmed booking. We do not subscribe you to marketing through this form. Further privacy and retention details must be completed before public launch.",
  ],
  [
    "Alberta law and consumer rights",
    "Alberta law and applicable Canadian federal law govern, subject to mandatory jurisdiction rules. Nothing waives or releases rights, benefits or protections under Alberta’s Consumer Protection Act, the Automotive Business Regulation, applicable sale-of-goods, privacy or other mandatory law. No mandatory arbitration, class-action waiver or restriction on lawful regulator complaints is imposed. You may seek assistance from AMVIC or Service Alberta and Red Tape Reduction, as appropriate. If a provision is invalid, the remaining provisions apply only to the extent lawful. Unclear language does not remove any interpretation rule that protects consumers.",
  ],
  [
    "Changes, notices and contract copies",
    "These terms are dated October 21, 2026. Updates apply prospectively to new agreements; they do not change an existing authorized job without agreement. Keep your accepted terms, quote, approvals and invoice. Business address, contact channels and any required licence details must be completed on the actual work order before a customer is asked to enter a service agreement. A legally required notice or cancellation form must be provided in its required form; this webpage is not a substitute.",
  ],
];
export default function Terms() {
  return (
    <div className="legal-layout">
      <div className="legal-toolbar">
        <a href="/" className="legal-back">
          <ArrowLeft size={17} /> Back to TorqLab
        </a>
      </div>
      <main
        className="wrap legal-page"
        tabIndex={0}
        aria-label="Terms and conditions"
      >
        <header>
          <p className="eyebrow">TORQLAB AUTOMOTIVE</p>
          <h1>Terms & Conditions</h1>
          <p className="muted">Service terms · Alberta · October 21, 2026</p>
          <p className="legal-notice">
            Draft for legal review. Business contact details are pending. This
            page alone does not create a service agreement or record customer
            acceptance.
          </p>
        </header>
        <nav className="legal-index" aria-label="Terms contents">
          {clauses.map(([title], i) => (
            <a href={`#term-${i + 1}`} key={title}>
              {String(i + 1).padStart(2, "0")} / {title}
            </a>
          ))}
        </nav>
        <div className="legal-clauses">
          {clauses.map(([title, text], i) => (
            <section id={`term-${i + 1}`} key={title}>
              <h2>
                {i + 1}. {title}
              </h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
        <section className="legal-contact">
          <h2>Business contact</h2>
          <p>
            2607521 Alberta Inc. trading as TorqLab Automotive · Calgary,
            Alberta
          </p>
          <dl>
            <dt>Mailing address</dt>
            <dd aria-label="Not yet provided">____________________</dd>
            <dt>Email</dt>
            <dd aria-label="Not yet provided">____________________</dd>
            <dt>Phone</dt>
            <dd aria-label="Not yet provided">____________________</dd>
          </dl>
        </section>
        <section className="legal-sources">
          <h2>Consumer information</h2>
          <a href="https://www.alberta.ca/consumer-bill-of-rights">
            Alberta Consumer Bill of Rights <ArrowUpRight size={14} />
          </a>
          <a href="https://www.alberta.ca/unfair-business-practices">
            Alberta unfair business practices <ArrowUpRight size={14} />
          </a>
          <a href="https://www.amvic.org/">
            AMVIC <ArrowUpRight size={14} />
          </a>
        </section>
        <details className="legal-credits">
          <summary>Website asset attribution</summary>
          <p>
            “2025 BMW M5 Sedan” by{" "}
            <a href="https://sketchfab.com/ddiaz-design">Ddiaz Design</a>, via{" "}
            <a href="https://sketchfab.com/3d-models/2025-bmw-m5-sedan-4ab34c43bada482b8e467be97ebaeba3">
              Sketchfab
            </a>
            . Supplied under{" "}
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
              CC BY-NC-SA 4.0
            </a>
            . Runtime changes include paint colour, roughness, metalness and
            environment lighting. No endorsement is implied.
          </p>
        </details>
      </main>
    </div>
  );
}
