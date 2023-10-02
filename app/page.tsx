"use client";
import { useEffect, useState, useMemo, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  // 연산자 배열을 메모이제이션
  const operator = useMemo(() => ["+", "-", "X", "÷"], []);
  // 계산기의 현재 값 상태
  const [value, setValue] = useState<string[]>([]);
  console.log("🚀 ~ file: page.tsx:12 ~ Home ~ value:", value);
  // 현재 입력 중인 숫자
  const [currentNumber, setCurrentNumber] = useState("");
  //계산 결과
  const [result, setResult] = useState<number>(0);

  // 연산자 뒤에 '='이 오면 알림을 띄우는 함수
  const equalAfterOperators = useCallback(() => {
    if (
      operator.includes(value[value.length - 2]) &&
      value[value.length - 1] === "="
    ) {
      alert("연산자 뒤에는 숫자가 와야합니다.");
      return true;
    }
    return false;
  }, [operator, value]);

  // 연산자가 연속으로 눌리면 마지막 연산자만 남기는 로직
  useEffect(() => {
    if (
      operator.includes(value[value.length - 1]) &&
      operator.includes(value[value.length - 2])
    ) {
      setValue((prevValue) => {
        const newValue = [...prevValue];
        newValue.splice(newValue.length - 2, 1);
        return newValue;
      });
    }

    if (equalAfterOperators()) {
      setValue((prevValue) => {
        const newValue = [...prevValue];
        newValue.splice(newValue.length - 1, 1);
        return newValue;
      });
    }
  }, [value, operator, equalAfterOperators]);

  useEffect(() => {
    if (value.includes("=")) {
      const calcResult = calculate(value);
      console.log(
        "🚀 ~ file: page.tsx:58 ~ useEffect ~ calcResult:",
        calcResult
      );
      setResult(calcResult);
      reset();
    }
  }, [value]);

  // 버튼 클릭 이벤트 핸들러
  const handleButton = (e: React.MouseEvent) => {
    const { textContent } = e.currentTarget as HTMLElement;

    if (textContent === "=") {
      // 계산 함수 호출
      handleOperator(textContent as string);
    }

    if (operator.includes(textContent as string)) {
      handleOperator(textContent as string);
    } else {
      handleNumber(textContent as string);
    }
  };

  // 연산자를 처리하는 함수
  const handleOperator = (op: string) => {
    if (currentNumber !== "") {
      setValue((prev) => [...prev, currentNumber, op]);
      setCurrentNumber(() => "");
    } else {
      setValue((prev) => [...prev, op]);
    }
  };

  // 숫자를 처리하는 함수
  const handleNumber = (num: string) => {
    setCurrentNumber(currentNumber + num);
  };

  // 모든 값을 초기화하는 함수
  const reset = () => {
    setValue([]);
    setCurrentNumber("");
  };

  // 계산을 수행하는 함수
  const calculate = (arr: string[]): number => {
    // Step 1: 곱셈과 나눗셈을 먼저 처리
    const tempArr = arr.reduce<(string | number)[]>((acc, cur, idx, src) => {
      if (cur === "X" || cur === "÷") {
        const prevNum = Number(acc.pop());
        const nextNum = Number(src[idx + 1]);
        const tempResult = cur === "X" ? prevNum * nextNum : prevNum / nextNum;
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

    return result;
  };

  // 디스플레이에 표시될 숫자를 결정하는 함수
  const displayNumber = () => {
    if (result) {
      return result;
    }

    if (currentNumber !== "") {
      return currentNumber;
    } else if (value.length > 0) {
      return value[value.length - 1];
    }
    return "0";
  };

  //TODO: 한 번 계산하고 나면 그 이후 계산은 디스플레이에 안보이는 문제 발생

  return (
    <div className="container h-screen flex items-center justify-center">
      <Card className="w-[350px] p-0">
        <CardHeader className="flex items-end bg-[#252524] text-white font-semibold">
          <CardTitle>{displayNumber()}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-rows-5 grid-cols-4">
          {value.length > 0 ? (
            <Button
              onClick={() => {
                setValue(value.slice(0, value.length - 1));
              }}
              className="bg-[#393939] border border-black"
            >
              C
            </Button>
          ) : (
            <Button
              onClick={reset}
              className="bg-[#393939] border border-black"
            >
              AC
            </Button>
          )}
          <Button
            onClick={handleButton}
            className="bg-[#393939] border border-black"
          >
            +/-
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#393939] border border-black"
          >
            %
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#FE9F0B] border border-black"
          >
            ÷
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            7
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            8
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            9
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#FE9F0B] border border-black"
          >
            X
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            4
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            5
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            6
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#FE9F0B] border border-black"
          >
            -
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            1
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            2
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            3
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#FE9F0B] border border-black"
          >
            +
          </Button>
          <Button
            onClick={handleButton}
            className="col-span-2 bg-[#5B5B5A] border border-black"
          >
            0
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#5B5B5A] border border-black"
          >
            .
          </Button>
          <Button
            onClick={handleButton}
            className="bg-[#FE9F0B] border border-black"
          >
            =
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
