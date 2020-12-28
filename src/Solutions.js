import React from "react";

const answers = [
  {
    day: "01",
    text: `The issue here is every level has four more branches than the previous
        branch and you have a thousand pieces of a Christmas decoration, so
        you need to find out how many layers sum up to a number one thousand.
        This issue can be solved using only three variables and one while
        loop. The first variable stores the number of layers, the second
        stores the number of branches on an actual layer, and the last
        variable stores the total number of branches. While loop is checking
        at every layer if the total number of branches is still smaller than
        one thousand. If this is false, we are some branches over and we need
        to subtract one from the number of layers. After that, all you need is
        to multiply the number of layers by 20 and that is the answer. <u>Correct answer was 440</u>.`,
  },
  {
    day: "02",
    text: `From a mathematical point of view the probability of "2" is 5/6^2 = 13.89% because in the first throw Alice needs anything except 6 - that is 5 different ways how to throw a dice and on a second throw she needs exactly the number 6, which is 1 way to get. When heaving 2 throws there are 36 = 6^2 possible pairs. The probability of "5" is with the same argument 5^4/6^5 = 8.04%. <u>So the correct answer was 2</u>.`,
  },
  {
    day: "03",
    text: `<u>Answer is 40.</u>`,
  },
  {
    day: "04",
    text: `The key is the way how the von Koch curve changes between two iterations. The algorithm is to take every line segment, divide it into thirds, and replace the middle third with two segments of length 1/3 of the previous line segment length. In one iteration, every line segment "grows" by 1/3 so its new length is 4/3 of the previous length. Starting with one lone segment with length 1 and repeating the process 10-times gives us a final length 1*(4/3)^10 =17.75772... <u>So the correct answer was 17.8</u>.`,
  },
  {
    day: "05",
    text: `The trickiest part of this problem is parsing the input. Let's have three classes for each form of writing IP addresses. Let each of those classes have methods low() and high() for finding the smallest and the biggest IP address it represents.<br />Sort the objects representing IP addresses from the input in descending order by the biggest address (high). Now iterate through the objects and keep track of the previous object and the current object. If the the biggest address of the current object is greater or equal to the smallest address of the previous address then we can join those in range. This also holds if the smallest address of the previous object is the very next address of the biggest address of the current object. Otherwise we have two distinct ranges.<br /><a target='_blank' href='https://gist.github.com/hruskraj/e1813a296b275f2a9810b0caa817ce22'>Here is a Python program which solves this problem</a>. The program uses special library called ipranges, which contains the classes with desired methods.<u>Answer is 67919.</u>`,
  },
  {
    day: "06",
    text: `You can solve this one using the fact that powers of numbers will repeat at some point. For number 1 the last digit is always 1. For number 3 the numbers 3, 9, 7, 1 repeat. For number 5 the last digit is always 5. For number 7 the numbers 7, 9, 3, 1 repeats. For number 9 numbers 9 and 1 repeat and lastly, for number 13 applies the same as for number 3. 2020 is a multiple of 4, and therefore, we need to look at the fourth number of every number and sum them up. So 1 + 1 + 5 + 1 + 1 + 1 is 10 and 10 modulo 10 is 0, <u>so the correct answer was 0.</u> `,
  },
  {
    day: "07",
    text: `Given an array of n integers a[1], a[2], ..., a[n], two elements a[i] and a[j] form an inversion if a[i] < a[j] and i > j. One swap decreases the total number of inversions by one, so the total number of required swaps to sort one array is equal to the total number of inversions in the given array. The final answer is the sum of the numbers of inversions of each permutation.<br />Inversions can by counted by a modification of Merge sort. During merge, there is a left part and a right part. If element from the right part of the array is selected, then it's bigger than all the elements of the left part, so they form inversions.<br /><a target='_blank' href='https://gist.github.com/hruskraj/2e16ca37b7e730343de17cd75e47290e'>Here is a program written in C++ which solves the problem</a>.<br /><u>Answer is 8618702222.</u>`,
  },
  {
    day: "08",
    text: `This problem can be solved using a technique called dynamic programming. Simple recursive function with a base case of sum 0 and summing recursively calculated solutions for a smaller and smaller array of coins. <u>Answer is 41.</u>`,
  },
  {
    day: "09",
    text: `<u>Answer is 1680.</u>`,
  },
  {
    day: "10",
    text: `<u>Answer is 2463180.</u>`,
  },
  {
    day: "11",
    text: `Okay, this one was a little bit harder to grasp. There were multiple parts that you needed to solve. The first part was encoded using a substitution cipher called Caesar cipher. This one replaces all letters with those that you will get when you move the alphabet by three letters forward. The second part was encoded using ROT13, another famous substitution cipher, in this case, the alphabet moves by 13 letters. Those two parts you were able to solve simply using brute force, where you move the alphabet step by step and trying to guess the correct position. Part three was using Vigenere cipher, which is a well-known polyalphabetic substitution cipher, where you needed to use our key "hack kosice". The last part of the problem was encrypted using the Enigma machine model M3. <u>The answer for the question after decoding all parts was bombe.</u>`,
  },
  {
    day: "12",
    text: `The first step was to recognize the author of the book The fractalist, which can be easily googled and the semi answer is Benoit B. Mandelbrot. The second part was to find out this is just a joke by the father of fractals, so the B. stands for the complete name, just shrunk into one letter. <u>So the correct answer is Benoit B. Mandelbrot.</u>`,
  },
  {
    day: "13",
    text: `First of all, you needed to convert those lines with binary numbers into ASCII letters. After that, you may see that those letters represents GPS coordinates, so the next step was to open Google Maps and write down the first letters of those villages. <u>Answer is impressive.</u>`,
  },
  {
    day: "14",
    text: `This one was very, very simple as opposed to others. Basic proportion is enough to solve it. We know, that formula of speed is v=s/t, so the time is t = s/v, we also know, that their times must be the same, so s1/v1 = s2/v2. Given that s1 is Santa's distance (2km), v1 Santa's velocity (5km/h) and v2 Bambi's speed (20km/h), we get s2 = (s1*v2)/v1. <u>So the answer is 8.</u>`,
  },
  {
    day: "15",
    text: `If you count all the symbols in Vladislav's system, you saw that its 32-bit system. So 196AA6692A8BCB558F632A93B196AA6692A8B6BB0C75E2BBAA694527B55F2A4BA79A355D32548748D1 can be represented as "thenameofthesystemisthenameofhisgirlfrendconvertedintohexadecimal". In Slovak calendar, you can see that yesterday (or 14th December) had Branislava her Name Day. After converting it to HEX we get an answer <u>F734DD889B66</u>.`,
  },
  {
    day: "16",
    text: `The hard way to solve this is to remember Newton's formula F=ma and know that a = dv/dt so by integrating the equation you can find out the analytic formula for v. But even the author of the problem didn't like this and used the law of conservation of energy. The key is to know from just highschool physics classes the formula mgh = 1/2 mv^2, so the v = sqrt(2gh). The height at which the sled dropped is f(6) - f(-12), <u>so the correct answer is 10.7.</u>`,
  },
  {
    day: "17",
    text: `The first possible way is to brute-force this problem by writing all the Fibonacci numbers up to 101th one and apply the formula. The second is to find the formula for the n-th Lucas number, which is ((1+sqrt(5))/2)^n + ((1-sqrt(5))/2)^n. <u>So the correct answer is 792070839848372253127</u>`,
  },
  {
    day: "18",
    text: `Here you can also brute-force, but please, don't do it on paper, at least in code. The other way is to find a formula for the winning seat by observing behavior on a smaller scale, e.g. for n in 1 to 20 than you can see, that when having n marbles in the game the winning seat w(n) = 2k+1 where n = 2^a + k, k<2a. So the correct answer is 1993.`,
  },
  {
    day: "19",
    text: `<u>Answer is 5 as it's the only satisfying prime number.</u>`,
  },
  {
    day: "20",
    text: `<u>Answer is 2037170.</u>`,
  },
  {
    day: "21",
    text: `<u>Answer is 5.</u>`,
  },
  {
    day: "22",
    text: `<u>Answer is 13655684.</u>`,
  },
  {
    day: "23",
    text: `Here you have two options. The first option to get the number of digits simply using modulo 9. This one can be a problem when you are using some data types which will overflow. The second and surely the better solution would be to remind that the number of digits can be found using rounding down a decimal logarithm. This one is much more efficient because we can use the logarithmic product rule, so we simply sum results of a decimal logarithm of numbers 1 through N. <u>So the correct answer is 456574.</u>`,
  },
  {
    day: "24",
    text: `This tough problem can be solved by hand, but it would be much more convenient to let the computer solve it. All you need to do is to loop through the expression and evaluate the inner parenthesis until there are none, then the same process with *, -, / and + operators. Probably the fastest solution is to use regular expressions to match sub-expressions, evaluate them recursively and return number. Demo solution written in JavaScript is <a target="_blank" href="https://repl.it/@DominikMatis/QuietLavenderIntegrationtesting#index.js">here</a>. <u>Solution is 176600.</u>`,
  },
];

const Solutions = () => {
  const s = parseInt(window.innerWidth) > 500 ? "20rem 1fr" : "1fr";
  return (
    <>
      <p style={{textAlign: 'center'}}>If you are interested in solutions a bit more, don't hesitate to <a href="mailto:contact@hackkosice.com?subject=HK Advent Solutions&body=Hi I'd like to know more about solution ##. Can you please explain it?">write us</a>. &#x1F609;</p>
      <h1>Solutions</h1>
      {answers.map((x, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: s,
            gridGap: "1rem",
          }}
        >
          <h1
            style={{ alignSelf: "flex-start", position: "sticky", top: "1rem" }}
          >
            {x.day}
          </h1>
          <p dangerouslySetInnerHTML={{ __html: x.text }} style={{lineHeight: '1.5rem', wordWrap: 'break-word'}} />
        </div>
      ))}
      <p style={{ paddingBottom: "20rem" }}></p>
    </>
  );
};

export default Solutions;
