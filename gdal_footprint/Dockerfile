# استفاده از ایماژ رسمی GDAL
FROM osgeo/gdal:alpine-small-latest

# تنظیمات محیطی
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# نصب پیش‌نیازها
RUN apk add --no-cache \
    postgresql-dev \
    python3-dev \
    py3-pip \
    build-base

# کپی فایل‌ها
COPY ./app/requirements.txt .
COPY ./app/main.py .
COPY ./app/.env .

# نصب کتابخانه‌های پایتون
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]