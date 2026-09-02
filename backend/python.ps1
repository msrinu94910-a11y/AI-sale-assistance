$py = "C:\Users\Lenovo\AppData\Local\Programs\Python\Python312\python.exe"
if ($args.Count -eq 0) {
    & $py "C:\Users\Lenovo\Downloads\AI sales assistant\backend\main.py"
} else {
    & $py $args
}
