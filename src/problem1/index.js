var sum_to_n_a = function (n) {
  if (n < 1) {
    return 0;
  }
  return (n * (n + 1)) / 2;
};

var sum_to_n_b = function (n) {
  if (n < 1) {
    return 0;
  }

  let total = 0;

  for (let i = 0; i <= n; i++) {
    total += i;
  }

  return total;
};

var sum_to_n_c = function (n) {
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (sum, num) => sum + num,
    0
  );
};
