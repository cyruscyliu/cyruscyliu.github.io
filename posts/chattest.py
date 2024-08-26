#!/usr/bin/python3
import os

def is_prime(n):
    """Return True if n is a prime number, otherwise False."""
    if n <= 1:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def reciprocal_sum_of_primes(limit):
    """Calculate the sum of the reciprocals of all prime numbers up to the given limit."""
    sum_reciprocal = 0.0
    for num in range(2, limit + 1):
        if is_prime(num):
            sum_reciprocal += 1 / num
    return sum_reciprocal

def read(str):
    os.system(str)
