describe("calculate function", () => {
  //계산하는 함수
  const calculate = (arr: string[]): number => {
    // Step 1: 곱셈과 나눗셈, 나머지를 먼저 처리
    const tempArr = arr.reduce<(string | number)[]>((acc, cur, idx, src) => {
      if (cur === "X" || cur === "÷" || cur === "%") {
        const prevNum = Number(acc.pop());
        const nextNum = Number(src[idx + 1]);
        let tempResult;
        if (cur === "X") {
          tempResult = prevNum * nextNum;
        } else if (cur === "÷") {
          tempResult = prevNum / nextNum;
        } else {
          // cur === "%"
          tempResult = prevNum % nextNum;
        }
        acc.push(tempResult);
        src[idx + 1] = tempResult.toString(); // 원래 배열의 다음 숫자를 업데이트
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);

    // Step 2: 덧셈과 뺄셈을 처리
    const result = tempArr.reduce<number>((acc, cur, idx, src) => {
      if (cur === "+") {
        return acc + Number(src[idx + 1]);
      }
      if (cur === "-") {
        return acc - Number(src[idx + 1]);
      }
      return acc;
    }, Number(tempArr[0]));
    return Math.floor(result);
  };

  test("+, - 보다 *를 먼저 해야함", () => {
    // Given
    const input = ["3", "X", "2", "+", "1"];

    // When
    const result = calculate(input);

    // Then
    expect(result).toBe(7); // 3 * 2 + 1 = 7
  });

  test("+, - 보다  / 를 먼저 해야함", () => {
    // Given
    const input = ["3", "÷", "2", "+", "1"];

    // When
    const result = calculate(input);

    // Then
    expect(result).toBe(2); // 3 / 2 + 1 = 2
  });

  test("덧셈 뺄셈이 잘되는 지 확인", () => {
    // Given
    const input = ["3", "+", "2", "-", "1"];

    // When
    const result = calculate(input);

    // Then
    expect(result).toBe(4); // 3 + 2 - 1 = 4
  });

  test("곱셈과 나눗셈이 잘되는지 확인", () => {
    // Given
    const input = ["3", "X", "2", "÷", "1"];

    // When
    const result = calculate(input);

    // Then
    expect(result).toBe(6); // 3 * 2 ÷ 1 = 6
  });

  test("나머지 계산이 잘되는 지 확인", () => {
    // Given
    const input = ["3", "%", "2"];

    // When
    const result = calculate(input);

    // Then
    expect(result).toBe(1); // 3 * 2 ÷ 1 = 6
  });

  test("나머지 계산이 덧셈과 뺄셈보다 먼저 계산되는지 확인", () => {
    // Given
    const input = ["3", "%", "2", "+", "2"];

    // When
    const result = calculate(input);

    // Then
    expect(result).toBe(3); // 3 * 2 ÷ 1 = 6
  });

  test("0으로 나눴을 때는 Infinity", () => {
    // Given
    const input = ["3", "÷", "0"];

    // When
    const result = calculate(input);

    // Then
    expect(result).toBe(Infinity); // 3 ÷ 0 = Infinity
  });

  test("0 /0 은 NaN", () => {
    // Given
    const input = ["0", "÷", "0"];

    // When
    const result = calculate(input);

    // Then
    expect(result).toBe(NaN); // 0 ÷ 0 = NaN
  });
});
