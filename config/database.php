<?php
// Database configuration for MongoDB
class DatabaseConfig {
    private $host = 'localhost';
    private $port = 27017;
    private $database = 'perfume_shop';
    private $connection;
    
    public function __construct() {
        $this->connect();
    }
    
    private function connect() {
        try {
            $this->connection = new MongoDB\Driver\Manager("mongodb://{$this->host}:{$this->port}");
        } catch (Exception $e) {
            error_log("MongoDB connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function getDatabase() {
        return $this->database;
    }
    
    // Insert document
    public function insert($collection, $document) {
        try {
            $bulk = new MongoDB\Driver\BulkWrite;
            $bulk->insert($document);
            
            $result = $this->connection->executeBulkWrite(
                $this->database . '.' . $collection, 
                $bulk
            );
            
            return $result->getInsertedCount() > 0;
        } catch (Exception $e) {
            error_log("Insert failed: " . $e->getMessage());
            return false;
        }
    }
    
    // Find documents
    public function find($collection, $filter = [], $options = []) {
        try {
            $query = new MongoDB\Driver\Query($filter, $options);
            $cursor = $this->connection->executeQuery(
                $this->database . '.' . $collection, 
                $query
            );
            
            return $cursor->toArray();
        } catch (Exception $e) {
            error_log("Find failed: " . $e->getMessage());
            return [];
        }
    }
    
    // Update document
    public function update($collection, $filter, $update, $options = []) {
        try {
            $bulk = new MongoDB\Driver\BulkWrite;
            $bulk->update($filter, $update, $options);
            
            $result = $this->connection->executeBulkWrite(
                $this->database . '.' . $collection, 
                $bulk
            );
            
            return $result->getModifiedCount() > 0;
        } catch (Exception $e) {
            error_log("Update failed: " . $e->getMessage());
            return false;
        }
    }
    
    // Delete document
    public function delete($collection, $filter, $options = []) {
        try {
            $bulk = new MongoDB\Driver\BulkWrite;
            $bulk->delete($filter, $options);
            
            $result = $this->connection->executeBulkWrite(
                $this->database . '.' . $collection, 
                $bulk
            );
            
            return $result->getDeletedCount() > 0;
        } catch (Exception $e) {
            error_log("Delete failed: " . $e->getMessage());
            return false;
        }
    }
}
?>
