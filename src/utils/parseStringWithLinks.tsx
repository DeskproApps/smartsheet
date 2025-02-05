import { Link } from "@deskpro/app-sdk";
import { P5 } from "@deskpro/deskpro-ui";

/**
 * Parses a string and replaces any detected URLs with a clickable Link
 *
 * @param {string} [text] - The input text that may contain URLs
 */
export default function parseStringWithLinks(text?: string) {

  if (!text) return text

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <P5 style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          <Link key={index} href={part} target="_blank">
            {part}
          </Link>
        ) : (
          part
        )
      )}
    </P5>
  )
}
