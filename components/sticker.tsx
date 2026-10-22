type StickerKind =
  | "pencil"
  | "star"
  | "bus"
  | "coin"
  | "mug"
  | "phone"
  | "bike";
export function Sticker({
  kind,
  className = "",
}: {
  kind: StickerKind;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`sticker sticker-${kind} ${className}`}>
      <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g
          stroke="#19171b"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {kind === "pencil" && (
            <g transform="rotate(-42 80 70)">
              <path d="M25 53H119L143 70 119 87H25Z" fill="#ff6b36" />
              <path d="m119 53 24 17-24 17Z" fill="#f6d7a6" />
              <path d="m133 63 10 7-10 7" fill="#19171b" />
              <path d="M25 53H44V87H25Q15 70 25 53" fill="#f7a9c7" />
              <path d="M44 53H55V87H44Z" fill="#f9f7f2" />
              <path d="M55 70H119M119 53V87" />
            </g>
          )}
          {kind === "star" && (
            <path
              d="M80 13Q87 61 126 70Q87 79 80 125Q73 79 34 70Q73 61 80 13Z"
              fill="#22b76b"
            />
          )}
          {kind === "coin" && (
            <>
              <circle cx="80" cy="70" r="53" fill="#ffc51c" />
              <circle cx="80" cy="70" r="42" stroke="#d89910" strokeWidth="3" />
              <text
                x="49"
                y="91"
                fill="#19171b"
                stroke="none"
                fontSize="63"
                fontWeight="900"
              >
                ₦
              </text>
            </>
          )}
          {kind === "bus" && (
            <g transform="rotate(-8 80 70)">
              <path d="M32 32V22H118V32" fill="#ff6b36" />
              <rect
                x="12"
                y="32"
                width="136"
                height="77"
                rx="17"
                fill="#ffc51c"
              />
              <path d="M14 78H146M14 94H146" />
              <rect
                x="23"
                y="43"
                width="19"
                height="23"
                rx="4"
                fill="#8ec6ff"
              />
              <rect
                x="49"
                y="43"
                width="19"
                height="23"
                rx="4"
                fill="#8ec6ff"
              />
              <rect
                x="75"
                y="43"
                width="19"
                height="23"
                rx="4"
                fill="#8ec6ff"
              />
              <rect
                x="101"
                y="43"
                width="31"
                height="31"
                rx="5"
                fill="#8ec6ff"
              />
              <circle cx="43" cy="110" r="12" fill="#faf8f3" />
              <circle cx="119" cy="110" r="12" fill="#faf8f3" />
              <path d="m36 102 14 16m-16-4 19-6m59-6 14 16m-16-4 19-6" />
              <path d="M135 85H139" stroke="#fff" />
            </g>
          )}
          {kind === "mug" && (
            <g transform="rotate(9 80 70)">
              <path
                d="M111 55C149 49 145 111 109 108L109 96C130 100 133 65 111 68"
                fill="#8ec6ff"
              />
              <rect
                x="39"
                y="40"
                width="75"
                height="83"
                rx="13"
                fill="#8ec6ff"
              />
              <path
                d="M57 27C45 15 64 14 58 4M80 27C68 15 86 14 80 4"
                strokeWidth="3"
              />
              <text
                x="49"
                y="87"
                fontFamily="cursive"
                fontStyle="italic"
                fontSize="20"
                fill="#19171b"
                stroke="none"
              >
                ship it
              </text>
            </g>
          )}
          {kind === "phone" && (
            <g transform="rotate(-10 80 70)">
              <rect
                x="43"
                y="8"
                width="74"
                height="124"
                rx="14"
                fill="#19171b"
              />
              <rect
                x="49"
                y="17"
                width="62"
                height="106"
                rx="8"
                fill="#3154df"
                strokeWidth="2"
              />
              <path d="M71 13H91" stroke="#6e6c75" strokeWidth="3" />
              <rect
                x="57"
                y="31"
                width="42"
                height="18"
                rx="9"
                fill="#fff"
                stroke="none"
              />
              <path d="M67 40H67M78 40H78M89 40H89" strokeWidth="4" />
              <rect
                x="66"
                y="57"
                width="37"
                height="18"
                rx="9"
                fill="#ffc51c"
                stroke="none"
              />
              <path
                d="M81 109C49 89 78 76 81 90C92 72 111 92 81 109Z"
                fill="#f7a9c7"
                strokeWidth="3"
              />
            </g>
          )}
          {kind === "bike" && (
            <>
              <circle cx="35" cy="110" r="19" fill="#19171b" />
              <circle cx="129" cy="110" r="19" fill="#19171b" />
              <circle cx="35" cy="110" r="11" fill="#faf8f3" />
              <circle cx="129" cy="110" r="11" fill="#faf8f3" />
              <path
                d="M35 110 56 76H103L129 110M35 110H91L103 76M119 49H139M125 49L129 110"
                fill="#faf8f3"
              />
              <path d="M62 69 85 71 103 91 93 101 76 86H55" fill="#ff6b36" />
              <path
                d="M78 36 65 32Q58 35 50 61Q49 73 65 73L78 47 113 61 119 51Z"
                fill="#1bb36a"
              />
              <circle cx="79" cy="22" r="13" fill="#e6bb8b" />
              <path d="M64 21Q64-2 82 5Q94 8 93 24Z" fill="#ffc51c" />
              <path d="M18 65H5M16 77H9" stroke="#afafaa" strokeWidth="3" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
