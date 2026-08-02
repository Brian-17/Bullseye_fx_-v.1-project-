def hash_password(plain: str) -> str:
    import hashlib
    return hashlib.sha256(plain.encode()).hexdigest()
