out = ""
n = int(input())
for i in range(n):
    out += f'\"{input()}\"'
    if i < n - 1:
        out += ', '
print(out)