#from fastapi import FastAPI, HTTPException, Query
#from fastapi.middleware.cors import CORSMiddleware
#from fastapi.responses import JSONResponse
import sqlite3
import os
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
#import uvicorn
from contextlib import contextmanager

# Pydantic models for request/response validation
from pydantic import BaseModel


class TickerResponse(BaseModel):
    id: int
    symbol: str
    name: str
    exchange: str
    region: str
    sector: str
    industry: str
    market_cap: float
    pe_ratio: Optional[float]
    created_at: str


class StockPriceResponse(BaseModel):
    id: int
    symbol: str
    price: float
    change: float
    change_percent: float
    volume: int
    last_updated: str


class StockResponse(BaseModel):
    id: str
    ticker: str
    name: str
    sector: str
    industry: str
    country: str
    exchange: str
    region: str
    type: str
    price: float
    change: float
    changePercent: float
    marketCap: float
    volume: int
    peRatio: Optional[float]
    lastUpdated: str


class PriceDataResponse(BaseModel):
    date: str
    open: float
    high: float
    low: float
    price: float  # This is 'close' in the database
    volume: int


class ETFHoldingResponse(BaseModel):
    ticker: str
    name: str
    weight: float
    sector: str
    industry: str
    country: str


class ETFResponse(BaseModel):
    id: str
    ticker: str
    name: str
    sector: str
    industry: str
    country: str
    exchange: str
    region: str
    type: str
    price: float
    change: float
    changePercent: float
    marketCap: float
    volume: int
    peRatio: Optional[float]
    lastUpdated: str
    holdings: List[ETFHoldingResponse]
    totalHoldings: int
    expenseRatio: float


class MarketSummaryResponse(BaseModel):
    totalStocks: int
    gainers: int
    losers: int
    avgChange: float
    totalMarketCap: float


class SectorPerformanceResponse(BaseModel):
    sector: str
    avgChange: float
    stockCount: int
    totalMarketCap: float


class CountryPerformanceResponse(BaseModel):
    country: str
    avgChange: float
    stockCount: int
    totalMarketCap: float


# Initialize FastAPI app
'''app = FastAPI(
    title="Stock Market API",
    description="API for stock market data and analysis",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)'''

# Database configuration
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "data", "tickers.db")


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = None
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        yield conn
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()


def map_ticker_and_price_to_stock(ticker_row: sqlite3.Row, price_row: sqlite3.Row) -> StockResponse:
    """Map database rows to Stock response model"""
    return StockResponse(
        id=str(ticker_row['id']),
        ticker=ticker_row['symbol'],
        name=ticker_row['name'],
        sector=ticker_row['sector'],
        industry=ticker_row['industry'],
        country=ticker_row['region'],  # Map region to country for consistency
        exchange=ticker_row['exchange'],
        region=ticker_row['region'],
        type='equity',  # Default to equity, you might want to add this to your database
        price=price_row['price'],
        change=price_row['change'],
        changePercent=price_row['change_percent'],
        marketCap=ticker_row['market_cap'],
        volume=price_row['volume'],
        peRatio=ticker_row['pe_ratio'],
        lastUpdated=price_row['last_updated']
    )


# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Stock Market API is running", "status": "healthy"}


@app.get("/api/stocks", response_model=List[StockResponse])
async def get_stocks():
    """Get all stocks with current prices"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Join tickers and stock_prices tables
            query = """
            SELECT 
                t.id, t.symbol, t.name, t.exchange, t.region, t.sector, t.industry, 
                t.market_cap, t.pe_ratio, t.created_at,
                sp.price, sp.change, sp.change_percent, sp.volume, sp.last_updated
            FROM tickers t
            LEFT JOIN stock_prices sp ON t.symbol = sp.symbol
            ORDER BY t.symbol
            """

            cursor.execute(query)
            rows = cursor.fetchall()

            stocks = []
            for row in rows:
                if row['price'] is not None:  # Only include stocks with price data
                    stock = map_ticker_and_price_to_stock(row, row)
                    stocks.append(stock)

            return stocks

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/stocks/search", response_model=List[StockResponse])
async def search_stocks(q: str = Query(..., min_length=1)):
    """Search stocks by ticker or name"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Search in both ticker symbol and name
            query = """
            SELECT 
                t.id, t.symbol, t.name, t.exchange, t.region, t.sector, t.industry, 
                t.market_cap, t.pe_ratio, t.created_at,
                sp.price, sp.change, sp.change_percent, sp.volume, sp.last_updated
            FROM tickers t
            LEFT JOIN stock_prices sp ON t.symbol = sp.symbol
            WHERE (LOWER(t.symbol) LIKE LOWER(?) OR LOWER(t.name) LIKE LOWER(?))
            AND sp.price IS NOT NULL
            ORDER BY t.symbol
            LIMIT 20
            """

            search_term = f"%{q}%"
            cursor.execute(query, (search_term, search_term))
            rows = cursor.fetchall()

            stocks = []
            for row in rows:
                stock = map_ticker_and_price_to_stock(row, row)
                stocks.append(stock)

            return stocks

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/stocks/{stock_id}", response_model=StockResponse)
async def get_stock_by_id(stock_id: str):
    """Get a specific stock by ID"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            query = """
            SELECT 
                t.id, t.symbol, t.name, t.exchange, t.region, t.sector, t.industry, 
                t.market_cap, t.pe_ratio, t.created_at,
                sp.price, sp.change, sp.change_percent, sp.volume, sp.last_updated
            FROM tickers t
            LEFT JOIN stock_prices sp ON t.symbol = sp.symbol
            WHERE t.id = ? AND sp.price IS NOT NULL
            """

            cursor.execute(query, (stock_id,))
            row = cursor.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Stock not found")

            stock = map_ticker_and_price_to_stock(row, row)
            return stock

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/stocks/{symbol}/prices", response_model=List[PriceDataResponse])
async def get_stock_prices(
        symbol: str,
        timeframe: str = Query("daily", regex="^(daily|hourly)$"),
        days: Optional[int] = Query(30, ge=1, le=365)
):
    """Get historical price data for a stock"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            if timeframe == "daily":
                # Calculate date range
                end_date = datetime.now().date()
                start_date = end_date - timedelta(days=days)

                query = """
                SELECT date, open, high, low, close, volume
                FROM prices_daily
                WHERE symbol = ? AND date >= ? AND date <= ?
                ORDER BY date DESC
                """

                cursor.execute(query, (symbol, start_date.isoformat(), end_date.isoformat()))

            else:  # hourly
                # For hourly data, get last N hours
                end_time = datetime.now()
                start_time = end_time - timedelta(hours=days * 24)  # Convert days to hours

                query = """
                SELECT timestamp as date, open, high, low, close, volume
                FROM prices_hourly
                WHERE symbol = ? AND timestamp >= ? AND timestamp <= ?
                ORDER BY timestamp DESC
                """

                cursor.execute(query, (symbol, start_time.isoformat(), end_time.isoformat()))

            rows = cursor.fetchall()

            prices = []
            for row in rows:
                price_data = PriceDataResponse(
                    date=row['date'],
                    open=row['open'],
                    high=row['high'],
                    low=row['low'],
                    price=row['close'],  # Map close to price
                    volume=row['volume']
                )
                prices.append(price_data)

            return prices

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/etfs", response_model=List[ETFResponse])
async def get_etfs():
    """Get all ETFs - Note: This is a placeholder as ETF structure needs to be defined"""
    # For now, return empty list since ETF structure isn't defined in the database
    # You would need to create ETF tables and populate them
    return []


@app.get("/api/etfs/{etf_id}", response_model=ETFResponse)
async def get_etf_by_id(etf_id: str):
    """Get a specific ETF by ID - Placeholder"""
    raise HTTPException(status_code=404, detail="ETF not found")


@app.get("/api/market/summary", response_model=MarketSummaryResponse)
async def get_market_summary():
    """Get market summary statistics"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            query = """
            SELECT 
                COUNT(*) as total_stocks,
                SUM(CASE WHEN sp.change > 0 THEN 1 ELSE 0 END) as gainers,
                SUM(CASE WHEN sp.change < 0 THEN 1 ELSE 0 END) as losers,
                AVG(sp.change_percent) as avg_change,
                SUM(t.market_cap) as total_market_cap
            FROM tickers t
            LEFT JOIN stock_prices sp ON t.symbol = sp.symbol
            WHERE sp.price IS NOT NULL
            """

            cursor.execute(query)
            row = cursor.fetchone()

            return MarketSummaryResponse(
                totalStocks=row['total_stocks'] or 0,
                gainers=row['gainers'] or 0,
                losers=row['losers'] or 0,
                avgChange=row['avg_change'] or 0.0,
                totalMarketCap=row['total_market_cap'] or 0.0
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/market/sectors", response_model=List[SectorPerformanceResponse])
async def get_sector_performance():
    """Get performance data by sector"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            query = """
            SELECT 
                t.sector,
                AVG(sp.change_percent) as avg_change,
                COUNT(*) as stock_count,
                SUM(t.market_cap) as total_market_cap
            FROM tickers t
            LEFT JOIN stock_prices sp ON t.symbol = sp.symbol
            WHERE sp.price IS NOT NULL
            GROUP BY t.sector
            ORDER BY avg_change DESC
            """

            cursor.execute(query)
            rows = cursor.fetchall()

            sectors = []
            for row in rows:
                sector = SectorPerformanceResponse(
                    sector=row['sector'],
                    avgChange=row['avg_change'] or 0.0,
                    stockCount=row['stock_count'] or 0,
                    totalMarketCap=row['total_market_cap'] or 0.0
                )
                sectors.append(sector)

            return sectors

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/market/countries", response_model=List[CountryPerformanceResponse])
async def get_country_performance():
    """Get performance data by country/region"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            query = """
            SELECT 
                t.region as country,
                AVG(sp.change_percent) as avg_change,
                COUNT(*) as stock_count,
                SUM(t.market_cap) as total_market_cap
            FROM tickers t
            LEFT JOIN stock_prices sp ON t.symbol = sp.symbol
            WHERE sp.price IS NOT NULL
            GROUP BY t.region
            ORDER BY avg_change DESC
            """

            cursor.execute(query)
            rows = cursor.fetchall()

            countries = []
            for row in rows:
                country = CountryPerformanceResponse(
                    country=row['country'],
                    avgChange=row['avg_change'] or 0.0,
                    stockCount=row['stock_count'] or 0,
                    totalMarketCap=row['total_market_cap'] or 0.0
                )
                countries.append(country)

            return countries

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)

    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )