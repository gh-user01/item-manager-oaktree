import os
from datetime import timedelta


class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'afzLTQjys_6fWs8FN3i2NmDR5LrMijp6gj8Z5OTrBls')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'olXVKbR-j_CmEDuvLfnVMKTroEo_8_SRdBZDEhqDQpI')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    DATABASE_PATH = "items.db"
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    CORS_ORIGINS = ["http://localhost:3000"]


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    # CORS_ORIGINS will be set via environment variable


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DATABASE_PATH = ":memory:"


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
