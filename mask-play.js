function handleInsertion(val, prev, currentCursor, newMask, delimiter) {
  if (newMask[currentCursor] === delimiter) {
    return {
      newValue: newMask,
      cursor: currentCursor + delimiter.length
    };
  }
}

function getDifferenceCount(val, prev) {
  let count = 0;
  for (let i = 0; i < prev.length; i++) {
    if (prev[i] !== val[i - count]) {
      count++;
    }
  }
  return count;
}

function handleDeletion(val, prev, currentCursor, mask, delimiter) {
  const numberOfDeletedCharacters = getDifferenceCount(val, prev);
  const isSingleDeletion = numberOfDeletedCharacters === 1;
  const isMultiDeletion = numberOfDeletedCharacters > 1;

  const delimiterRegex = new RegExp(delimiter, 'g');
  const oldDelimiterCount = (prev.match(delimiterRegex) || []).length;
  const newDelimiterCount = (val.match(delimiterRegex) || []).length;
  const deletionIncludedDelimiter = newDelimiterCount < oldDelimiterCount;

  if (isMultiDeletion) {
    const newMask = mask(val);
    const newMaskDelimiterCount = (newMask.match(delimiterRegex) || []).length;
    const maskRemovedDelimiter = newMaskDelimiterCount < oldDelimiterCount;

    if (currentCursor === 0) {
      return {
        newValue: mask(val),
        cursor: currentCursor
      };
    }

    if (maskRemovedDelimiter) {
      return {
        newValue: mask(val),
        cursor: currentCursor - 1
      };
    }

    if (deletionIncludedDelimiter) {
      return {
        newValue: mask(val),
        cursor: currentCursor + 1
      };
    }

    // last ditch, no test
    return {
      newValue: mask(val),
      cursor: currentCursor
    };
  } else if (isSingleDeletion) {
    if (val[currentCursor] === delimiter) {
      // todo: no test?
      return {
        newValue: mask(val.slice(0, -1)),
        cursor: currentCursor - 1
      };
    } else {
      // test single deletion on delimiter
      const firstDifferenctCharacterIndex = findFirstDifferentCharacterIndex(
        val,
        prev
      );
      if (prev[firstDifferenctCharacterIndex] === delimiter) {
        return {
          newValue: mask(
            val.slice(0, currentCursor - 1) + val.slice(currentCursor)
          ),
          cursor: currentCursor - 1
        };
      } else {
        // test single deletion non delimiter
        return {
          newValue: mask(val),
          cursor: currentCursor
        };
      }
    }
  }
}

// unmasked values as input
function findFirstDifferentCharacterIndex(val, prev) {
  return prev.split('').findIndex((_, index) => prev[index] !== val[index]);
}

function doIt({
  val = '',
  prev = '',
  mask = x => x,
  currentCursor,
  delimiter
}) {
  const isDeletion = val.length < prev.length;
  const isInsertion = val.length > prev.length;

  let result;
  const newMask = mask(val);
  if (isInsertion) {
    result = handleInsertion(val, prev, currentCursor, newMask, delimiter);
  } else if (isDeletion) {
    result = handleDeletion(val, prev, currentCursor, mask, delimiter);
  } else {
    // foo
  }

  return result;
}

export { findFirstDifferentCharacterIndex, doIt };

/**
 * prev: 12,345
 * new: 1245
 * new-caret: 12^45
 * desired: 1,2^45
 * 1,245 caret at [3]
 */
