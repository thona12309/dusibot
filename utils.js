export function extractJsonArray(text, startPattern) {
  const startIndex = text.indexOf(startPattern);
  if (startIndex === -1) {
    console.error(`시작 패턴 "${startPattern}" 을 찾을 수 없습니다.`);
    return null;
  }

  let bracketCount = 0;
  let isCapturing = false;
  let result = "";

  const slicedText = text.slice(startIndex + startPattern.length).trim();

  for (let i = 0; i < slicedText.length; i++) {
    const char = slicedText[i];

    if (char === "[") {
      bracketCount++;
      isCapturing = true;
    }

    if (isCapturing) {
      result += char;
    }

    if (char === "]") {
      bracketCount--;
      if (bracketCount === 0) {
        break;
      }
    }
  }

  if (bracketCount !== 0) {
    console.error("대괄호가 맞지 않습니다. 배열이 완전히 닫히지 않았습니다.");
    return null;
  }

  return result;
}